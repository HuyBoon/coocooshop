import { NextResponse } from "next/server";
import { Gallery } from "@/models/Gallery";

import { deleteFromCloudinary } from "@/libs/cloudinaryConnect";
import { dbConnect } from "@/libs/dbConnect";


export async function POST(req: Request) {
    try {
        const { publicIds } = await req.json();

        if (!Array.isArray(publicIds) || publicIds.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Không có ảnh nào để xóa!",
            }, { status: 400 });
        }

        await dbConnect();
        // 1. Xóa ảnh trên Cloudinary
        const cloudinaryResults = await Promise.all(publicIds.map((id) => deleteFromCloudinary(id)));

        const deletedPublicIds = cloudinaryResults
            .filter((res) => res.success)
            .map((res) => res.public_id);

        const failedDeletes = cloudinaryResults.filter((res) => !res.success);
        // 2. Xóa ảnh khỏi MongoDB
        if (deletedPublicIds.length > 0) {
            await Gallery.updateMany(
                {},
                { $pull: { images: { public_id: { $in: deletedPublicIds } } } }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Hoàn tất xử lý.",
            deleted: deletedPublicIds,
            failed: failedDeletes,
        });
    } catch (error) {
        console.error("Lỗi khi xóa nhiều ảnh:", error);
        return NextResponse.json({
            success: false,
            message: "Lỗi server khi xóa ảnh!",
        }, { status: 500 });
    }
}

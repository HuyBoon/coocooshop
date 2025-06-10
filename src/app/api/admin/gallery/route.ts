import { Gallery } from "@/models/Gallery";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        if (page < 1 || limit < 1) {
            return NextResponse.json(
                { success: false, message: "Tham số page hoặc limit không hợp lệ." },
                { status: 400 }
            );
        }

        const skip = (page - 1) * limit;

        if (!category) {
            // Nếu không có category, trả về ảnh từ category "chưa xác định"
            const galleryDoc = await Gallery.findOne({ category: "chưa xác định" }).sort({ "images.createdAt": -1 });
            const totalImages = galleryDoc ? galleryDoc.images.length : 0;
            const images = galleryDoc
                ? galleryDoc.images
                    .slice(skip, skip + limit)
                    .map((img: any) => ({
                        url: img.imgUrl,
                        public_id: img.public_id,
                    }))
                : [];

            return NextResponse.json(
                {
                    success: true,
                    images,
                    pagination: {
                        page,
                        limit,
                        totalImages,
                        totalPages: Math.ceil(totalImages / limit),
                    },
                },
                { status: 200 }
            );
        }

        if (category === "all") {
            // Lấy tất cả ảnh từ mọi category
            const galleries = await Gallery.find({}).sort({ "images.createdAt": -1 });
            const allImages = galleries
                .flatMap((gallery: any) =>
                    gallery.images.map((img: any) => ({
                        url: img.imgUrl,
                        public_id: img.public_id,
                    }))
                )
                .sort((a, b) => b.public_id.localeCompare(a.public_id)); // Sắp xếp theo public_id

            const totalImages = allImages.length;
            const images = allImages.slice(skip, skip + limit);

            return NextResponse.json(
                {
                    success: true,
                    images,
                    pagination: {
                        page,
                        limit,
                        totalImages,
                        totalPages: Math.ceil(totalImages / limit),
                    },
                },
                { status: 200 }
            );
        }

        // Tìm gallery theo category
        const galleryDoc = await Gallery.findOne({ category }).sort({ "images.createdAt": -1 });
        const totalImages = galleryDoc ? galleryDoc.images.length : 0;
        const images = galleryDoc
            ? galleryDoc.images
                .slice(skip, skip + limit)
                .map((img: any) => ({
                    url: img.imgUrl,
                    public_id: img.public_id,
                }))
            : [];

        return NextResponse.json(
            {
                success: true,
                images,
                pagination: {
                    page,
                    limit,
                    totalImages,
                    totalPages: Math.ceil(totalImages / limit),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Lỗi khi lấy gallery:", error);
        return NextResponse.json(
            { success: false, message: "Đã xảy ra lỗi server." },
            { status: 500 }
        );
    }
}
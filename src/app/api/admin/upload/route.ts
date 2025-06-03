import { NextRequest, NextResponse } from "next/server";
import { Gallery } from "@/models/Gallery";
import { dbConnect } from "@/libs/dbConnect";



export async function POST(req: NextRequest) {
    await dbConnect();

    const formData = await req.formData();
    const category = formData.get("category")?.toString();
    const files = formData.getAll("files") as File[];

    if (!category || files.length === 0) {
        return NextResponse.json({ success: false, message: "Thiếu category hoặc file" }, { status: 400 });
    }

    const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadResults: { imgUrl: string; public_id: string }[] = [];

    for (const file of files) {
        const formDataToUpload = new FormData();
        formDataToUpload.append("file", file);
        formDataToUpload.append("upload_preset", "coocoo");
        formDataToUpload.append("folder", `Gallery/${category}`); // ← Thêm category vào folder path

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                { method: "POST", body: formDataToUpload }
            );

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            uploadResults.push({
                imgUrl: data.secure_url,
                public_id: data.public_id,
            });
        } catch (error) {
            console.error("Error uploading image to Cloudinary", error);
            return NextResponse.json({ success: false, message: "Upload thất bại" }, { status: 500 });
        }
    }

    try {
        // Tìm document Gallery theo category
        const existing = await Gallery.findOne({ category });

        if (existing) {
            existing.images.push(...uploadResults);
            await existing.save();
        } else {
            await Gallery.create({
                category,
                images: uploadResults,
            });
        }

        return NextResponse.json({ success: true, images: uploadResults });
    } catch (error) {
        console.error("Error saving to DB:", error);
        return NextResponse.json({ success: false, message: "Lỗi khi lưu DB" }, { status: 500 });
    }
}

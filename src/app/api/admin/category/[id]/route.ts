import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import { ProductCategory } from "@/models/ProductCategory";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const category = await ProductCategory.findById(params.id).lean();
        if (!category) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy danh mục" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const body = await request.json();

        const { name, slug, description, thumbnail, type } = body;
        if (!name || !slug || !type) {
            return NextResponse.json(
                { success: false, error: "Tên, slug và loại danh mục là bắt buộc" },
                { status: 400 }
            );
        }

        const existingCategory = await ProductCategory.findOne({
            slug,
            _id: { $ne: params.id },
        });
        if (existingCategory) {
            return NextResponse.json(
                { success: false, error: "Slug đã tồn tại" },
                { status: 400 }
            );
        }

        const category = await ProductCategory.findByIdAndUpdate(
            params.id,
            { name, slug, description, thumbnail, type },
            { new: true }
        );

        if (!category) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy danh mục" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const category = await ProductCategory.findByIdAndDelete(params.id);
        if (!category) {
            return NextResponse.json(
                { success: false, error: "Không tìm thấy danh mục" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, message: "Danh mục đã được xóa" });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import { ProductCategory } from "@/models/ProductCategory";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const totalItems = await ProductCategory.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
        const categories = await ProductCategory.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .select("-__v");

        return NextResponse.json({
            success: true,
            categories,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
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

        const existingCategory = await ProductCategory.findOne({ slug });
        if (existingCategory) {
            return NextResponse.json(
                { success: false, error: "Slug đã tồn tại" },
                { status: 400 }
            );
        }

        const category = await ProductCategory.create({
            name,
            slug,
            description,
            thumbnail,
            type,
        });

        return NextResponse.json({ success: true, category }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
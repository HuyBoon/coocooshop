import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import { BlogCategory } from "@/models/BlogCategory";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const totalItems = await BlogCategory.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
        const categories = await BlogCategory.find()
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

        const { name, slug, description } = body;
        if (!name || !slug) {
            return NextResponse.json(
                { success: false, error: "Tên, slug và loại danh mục là bắt buộc" },
                { status: 400 }
            );
        }

        const existingCategory = await BlogCategory.findOne({ slug });
        if (existingCategory) {
            return NextResponse.json(
                { success: false, error: "Slug đã tồn tại" },
                { status: 400 }
            );
        }

        const category = await BlogCategory.create({
            name,
            slug,
            description,

        });

        return NextResponse.json({ success: true, category }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
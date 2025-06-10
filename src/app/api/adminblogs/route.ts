import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import { Blog } from "@/models/Blog";
import "@/models/BlogCategory";
import mongoose from "mongoose";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    try {
        await dbConnect();
        const totalItems = await Blog.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
        const blogs = await Blog.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("category", "name")
            .lean()
            .select("-__v -createdAt -updatedAt");

        return NextResponse.json({
            success: true,
            blogs,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch (error: any) {
        console.error("GET /api/adminblogs error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.slug || !body.category) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: title, slug, or category" },
                { status: 400 }
            );
        }

        // Ensure thumbnail is a string
        if (body.thumbnail && typeof body.thumbnail === "object") {
            body.thumbnail = body.thumbnail.url || "";
        }

        // Validate category as ObjectId
        if (!mongoose.Types.ObjectId.isValid(body.category)) {
            return NextResponse.json(
                { success: false, error: "Invalid category ID" },
                { status: 400 }
            );
        }

        const blog = await Blog.create(body);
        return NextResponse.json({ success: true, blog });
    } catch (error: any) {
        console.error("POST /api/adminblogs error:", error);
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { success: false, error: errors.join(", ") },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create blog" },
            { status: 400 }
        );
    }
}
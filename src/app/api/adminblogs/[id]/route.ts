import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import mongoose from "mongoose";
import { Blog } from "@/models/Blog";
import "@/models/BlogCategory";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid blog ID" },
                { status: 400 }
            );
        }

        const blog = await Blog.findById(id)
            .populate("category", "name")
            .lean()
            .select("-__v -createdAt -updatedAt");

        if (!blog) {
            return NextResponse.json(
                { success: false, error: "Bài viết không tồn tại" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            blog: {
                ...blog,
                _id: blog._id.toString(),
                category: {
                    _id: blog.category?._id?.toString() ?? "",
                    name: blog.category?.name ?? "",
                },
            },
        });
    } catch (error: any) {
        console.error("GET /api/adminblogs/[id] error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const body = await req.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid blog ID" },
                { status: 400 }
            );
        }

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

        const blog = await Blog.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        })
            .populate("category", "name")
            .lean()
            .select("-__v -createdAt -updatedAt");

        if (!blog) {
            return NextResponse.json(
                { success: false, error: "Bài viết không tồn tại" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            blog: {
                ...blog,
                _id: blog._id.toString(),
                category: {
                    _id: blog.category?._id?.toString() ?? "",
                    name: blog.category?.name ?? "",
                },
            },
        });
    } catch (error: any) {
        console.error("PUT /api/adminblogs/[id] error:", error);
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { success: false, error: errors.join(", ") },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || "Failed to update blog" },
            { status: 400 }
        );
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: "Invalid blog ID" },
                { status: 400 }
            );
        }

        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return NextResponse.json(
                { success: false, error: "Bài viết không tồn tại" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE /api/adminblogs/[id] error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Server error" },
            { status: 500 }
        );
    }
}
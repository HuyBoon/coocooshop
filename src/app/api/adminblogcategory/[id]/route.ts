import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import { BlogCategory } from "@/models/BlogCategory";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const category = await BlogCategory.findById(id);
        if (!category) {
            return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const body = await req.json();
        const category = await BlogCategory.findByIdAndUpdate(id, body, { new: true });
        if (!category) {
            return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const category = await BlogCategory.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Category deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
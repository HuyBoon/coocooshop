import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import { BlogCategory } from "@/models/BlogCategory";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const category = await BlogCategory.findById(params.id);
        if (!category) {
            return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const body = await request.json();
        const category = await BlogCategory.findByIdAndUpdate(params.id, body, { new: true });
        if (!category) {
            return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const category = await BlogCategory.findByIdAndDelete(params.id);
        if (!category) {
            return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Category deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
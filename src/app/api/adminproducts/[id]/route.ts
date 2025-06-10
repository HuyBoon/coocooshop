import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import { Product } from "@/models/Product";
import "@/models/ProductCategory";
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const product = await Product.findById(id)
            .populate("categories", "name")
            .lean();
        if (!product) {
            return NextResponse.json(
                { success: false, error: "Sản phẩm không tồn tại" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const body = await req.json();
        const product = await Product.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return NextResponse.json(
                { success: false, error: "Sản phẩm không tồn tại" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.json(
                { success: false, error: "Sản phẩm không tồn tại" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
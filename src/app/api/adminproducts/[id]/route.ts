import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import { Product } from "@/models/Product";
import "@/models/ProductCategory";
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const product = await Product.findById(params.id)
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const body = await request.json();
        const product = await Product.findByIdAndUpdate(params.id, body, {
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const product = await Product.findByIdAndDelete(params.id);
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
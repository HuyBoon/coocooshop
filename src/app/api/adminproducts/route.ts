import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import { Product } from "@/models/Product";
import "@/models/ProductCategory";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    try {
        await dbConnect();
        const totalItems = await Product.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("categories", "name")
            .lean()
            .select("-__v");

        return NextResponse.json({
            success: true,
            products,
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
        const product = await Product.create(body);
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
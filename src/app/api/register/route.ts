// api/register/route.ts
import { dbConnect } from "@/libs/dbConnect";
import { AdminUser } from "@/models/AdminUser";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { name, email, password, admin = false, superAdmin = false } = body;

        // Validate input fields
        if (!name || !email || !password) {
            return new Response(
                JSON.stringify({ message: 'Please provide all required fields: name, email, and password.' }),
                { status: 400 }
            );
        }
        // Check password length
        if (password.length < 5) {
            return new Response(
                JSON.stringify({ message: 'Password must be at least 5 characters' }),
                { status: 400 }
            );
        }

        // Check if the user already exists
        const existingUser = await AdminUser.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ message: 'Email is already registered' }),
                { status: 400 }
            );
        }

        // Nếu muốn tạo super admin, kiểm tra xem người tạo có phải super admin không
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (superAdmin && (!token || !token.superAdmin)) {
            return new Response(
                JSON.stringify({ message: 'Only super admin can create another super admin' }),
                { status: 403 }
            );
        }

        // Hash the password asynchronously
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const createdUser = await AdminUser.create({ name, email, password: hashedPassword, admin, superAdmin });

        // Return the created user without the password
        const { password: _, ...userWithoutPassword } = createdUser.toObject();
        return new Response(JSON.stringify(userWithoutPassword), { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        console.error("Error creating user:", errorMessage);
        return new Response(
            JSON.stringify({ message: 'Something went wrong', error: errorMessage }),
            { status: 500 }
        );
    }
}

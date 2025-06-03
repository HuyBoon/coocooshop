import clientPromise from "@/libs/mongoConnect";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { dbConnect } from "./dbConnect";
import { AdminUser } from "@/models/AdminUser";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: MongoDBAdapter(clientPromise) as Adapter,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "test@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Validate credentials
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(credentials.email)) {
                    throw new Error("Invalid email format");
                }

                // Connect to database
                await dbConnect();

                // Find admin user by email
                const user = await AdminUser.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error("Invalid email or password");
                }

                // Compare password using bcrypt
                const passwordOk = await bcrypt.compare(credentials.password, user.password);
                if (!passwordOk) {
                    throw new Error("Invalid email or password");
                }

                // Return user data for NextAuth
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    admin: user.admin,
                    superAdmin: user.superAdmin,
                };
            },
        }),
    ],
    callbacks: {
        // Add custom fields to JWT
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.admin = Boolean(user.admin);
                token.superAdmin = Boolean(user.superAdmin);
            }
            return token;
        },
        // Add custom fields to session
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                session.user.admin = Boolean(token.admin);
                session.user.superAdmin = Boolean(token.superAdmin);
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 1 ngày
        updateAge: 60 * 60,   // cập nhật sau 1 tiếng
    },
};

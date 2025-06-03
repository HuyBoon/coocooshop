import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Kiểm tra NEXTAUTH_SECRET
    if (!process.env.NEXTAUTH_SECRET) {
        console.error('NEXTAUTH_SECRET is not defined');
        return NextResponse.redirect(new URL('/error', req.url));
    }

    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        // Nếu không có token, chuyển hướng đến /login
        if (!token) {
            console.log(`Unauthorized access to ${pathname}, redirecting to /login`);
            return NextResponse.redirect(new URL('/', req.url));
        }

        const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
        const isSuperAdminRoute = pathname.startsWith('/superadmin') || pathname.startsWith('/api/superadmin');

        if (isAdminRoute && !(token.admin || token.superAdmin)) {
            console.log(`Access denied to ${pathname} for user ${token.email}`);
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        if (isSuperAdminRoute && !token.superAdmin) {
            console.log(`Access denied to ${pathname} for user ${token.email}`);
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error(`Middleware error: ${error}`);
        return NextResponse.redirect(new URL('/error', req.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/superadmin/:path*', '/api/admin/:path*', '/api/superadmin/:path*'],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    // Only check admin routes
    if (!request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Exclude login page from check to avoid infinite loop
    if (request.nextUrl.pathname === '/admin/login') {
        return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me-in-prod');
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (error) {
        // Invalid token
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
}

export const config = {
    matcher: '/admin/:path*',
};

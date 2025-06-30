// File: src/middleware.ts (Phiên bản cuối cùng, xử lý được route động)

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ROUTES } from './routes';
import { ROLE } from '@constants/common';
import { handleStatus } from '@middlewares/status';

// DANH SÁCH CÁC TIỀN TỐ CẦN ĐƯỢC BẢO VỆ (YÊU CẦU ĐĂNG NHẬP)
const PROTECTED_PREFIXES = [
    ROUTES.ADMIN.ROOT,
    ROUTES.STAFF.ROOT,
    ROUTES.VENDOR.ROOT,
    ROUTES.USER.PROFILE.INFO,
    ROUTES.USER.CHAT_ROOT,
    ROUTES.USER.CHECKOUT
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const paymentErrorResponse = handleStatus(req);
    if (paymentErrorResponse) return paymentErrorResponse;

    const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


    if (!token) {
        const loginUrl = new URL(ROUTES.AUTH.LOGIN, req.url);
        return NextResponse.redirect(loginUrl);
    }

    const userRole = (token as any).role?.name;

    if (pathname.startsWith(ROUTES.ADMIN.ROOT) && userRole !== ROLE.ADMIN) {
        return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, req.url));
    }

    if (pathname.startsWith(ROUTES.STAFF.ROOT) && userRole !== ROLE.STAFF) {
        return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, req.url));
    }

    if (pathname.startsWith(ROUTES.VENDOR.ROOT) && userRole !== ROLE.VENDOR_OWNER) {
        return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
    ],
};
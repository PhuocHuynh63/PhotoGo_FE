// File: src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { authConfig } from "@middlewares/auth";
import { ROUTES } from "./routes";

function mainMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === ROUTES.PUBLIC.PAYMENT_ERROR) {
        const paymentId = request.nextUrl.searchParams.get('paymentId');
        if (!paymentId) {
            return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, request.url));
        }
    }

    return NextResponse.next();
}

const fullMiddleware = withAuth(mainMiddleware, authConfig);

export default fullMiddleware;
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
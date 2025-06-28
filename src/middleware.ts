// File: src/middleware.ts

import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { authConfig } from "@middlewares/auth";
import { ROUTES } from "./routes";

function mainMiddleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;
    console.log('Middleware running for:', pathname);

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
        '/((?!api|_next/static|_next/image|favicon.ico|auth/login/google).*)'
    ],
};
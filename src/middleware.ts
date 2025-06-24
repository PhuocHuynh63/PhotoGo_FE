import { authConfig, authMatcher } from "@middlewares/auth";
import { handleStatus, handleStatusSuccess, paymentErrorMatcher, paymentSuccessMatcher } from "@middlewares/status";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

function mainMiddleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    /**
     * Check payment status
     * - Payment error page
     */
    if (paymentErrorMatcher.includes(pathname)) {
        const response = handleStatus(request);
        if (response) return response;
    }
    /**
     * Check payment status
     * - Payment success page
     */
    if (paymentSuccessMatcher.includes(pathname)) {
        const response = handleStatusSuccess(request);
        if (response) return response;
    }

    return NextResponse.next();
}

const fullMiddleware = withAuth(mainMiddleware, authConfig);

export default fullMiddleware;

export const config = {
    matcher: [
        ...paymentErrorMatcher,
        ...authMatcher,
        ...paymentSuccessMatcher
    ],
};
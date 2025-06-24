import { authConfig, authMatcher } from "@middlewares/auth";
import { handleStatus, paymentErrorMatcher } from "@middlewares/status";
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

    return NextResponse.next();
}

const fullMiddleware = withAuth(mainMiddleware, authConfig);

export default fullMiddleware;

export const config = {
    matcher: paymentErrorMatcher.concat(authMatcher),
};
import { ROUTES } from "@routes";
import { NextRequest, NextResponse } from "next/server";

export function handleStatus(request: NextRequest) {
    if (request.nextUrl.pathname === ROUTES.PUBLIC.PAYMENT_ERROR) {
        const paymentId = request.nextUrl.searchParams.get('paymentId');

        if (!paymentId) {
            return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, request.url));
        }
    }
    return undefined;
}
export const paymentErrorMatcher = [ROUTES.PUBLIC.PAYMENT_ERROR];

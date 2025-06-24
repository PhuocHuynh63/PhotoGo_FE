import { ROUTES } from "@routes";
import { NextRequest, NextResponse } from "next/server";

export function handleStatus(request: NextRequest) {
    if (request.nextUrl.pathname === ROUTES.PUBLIC.PAYMENT_ERROR) {
        const paymentId = request.nextUrl.searchParams.get('paymentId');

        if (!paymentId) {
            return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, request.url));
        }
    }
}
export const paymentErrorMatcher = [ROUTES.PUBLIC.PAYMENT_ERROR];

export function handleStatusSuccess(request: NextRequest) {
    if (request.nextUrl.pathname === ROUTES.PUBLIC.PAYMENT_SUCCESS) {
        const paymentOSI = request.nextUrl.searchParams.get('id');
        const id = request.nextUrl.searchParams.get('id');
        //call api put booking status to pending
        // const booking = await BookingService.getBookingByPaymentOSId(paymentOSI);
        // if (booking) {
        //     await BookingService.updateBooking(booking.id, { status: "pending" });
        // }
        if (!paymentOSI) {
            return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, request.url));
        } else {
            const redirectUrl = new URL(ROUTES.USER.PROFILE.ORDERS, request.url);
            redirectUrl.searchParams.set('id', paymentOSI);
            if (id) redirectUrl.searchParams.set('id', id);
            return NextResponse.redirect(redirectUrl);
        }
    }
}
export const paymentSuccessMatcher = [ROUTES.PUBLIC.PAYMENT_SUCCESS];

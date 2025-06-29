import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ROUTES } from './routes';
import { ROLE } from '@constants/common';
import { handleStatus } from '@middlewares/status';

const PUBLIC_PATHS = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
    ROUTES.AUTH.VERIFY_EMAIL,
    ROUTES.AUTH.VERIFY_OTP,
    ROUTES.PUBLIC.ABOUT,
    ROUTES.PUBLIC.SEARCH_PACKAGES,
    ROUTES.PUBLIC.SEARCH_VENDORS,
    ROUTES.PUBLIC.SUPPORT,
    ROUTES.PUBLIC.VENDOR_DETAIL,
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const paymentErrorResponse = handleStatus(req);
    if (paymentErrorResponse) return paymentErrorResponse;

    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('token:', token);

    if (!token) {
        const loginUrl = new URL(ROUTES.AUTH.LOGIN, req.url);
        loginUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(loginUrl);
    }

    const userRole = (token as any).role?.description;

    if ((pathname.startsWith(ROUTES.ADMIN.ROOT) && userRole !== ROLE.ADMIN) ||
        (pathname.startsWith(ROUTES.STAFF.ROOT) && userRole !== ROLE.STAFF)) {
        return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, req.url));
    }

    if (pathname.startsWith(ROUTES.VENDOR.ROOT) && userRole !== ROLE.VENDOR_OWNER) {
        return NextResponse.redirect(new URL(ROUTES.PUBLIC.HOME, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|auth/login/google).*)',
    ],
};
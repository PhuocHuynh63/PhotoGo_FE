import { ROUTES } from "@/routes";
import { ROLE } from "@constants/common";
import { METADATA } from "../../types/IMetadata";
import { NextRequest } from "next/server";

export const authConfig = {
    pages: {
        signIn: ROUTES.AUTH.LOGIN,
    },

    callbacks: {
        authorized: ({ req, token }: { req: NextRequest; token: any | null }) => {
            console.log("Auth Middleware - authorized callback", token?.role?.name);

            const { pathname } = req.nextUrl;

            const publicPaths = [
                ROUTES.PUBLIC.HOME,

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

            if (publicPaths.some(path => pathname.startsWith(path))) {
                return true;
            }

            if (!token) {
                return false;
            }

            if (pathname.startsWith(ROUTES.ADMIN.DASHBOARD)) {
                return token?.role?.description === ROLE.ADMIN;
            }

            if (pathname.startsWith(ROUTES.STAFF.DASHBOARD)) {
                return token?.role?.description === ROLE.STAFF;
            }

            if (pathname.startsWith(ROUTES.VENDOR.PROFILE)) {
                return token?.role?.description === ROLE.VENDOR_OWNER;
            }

            return true;
        },
    },
};
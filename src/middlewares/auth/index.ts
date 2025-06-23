import { ROUTES } from "@/routes";

export const authConfig = {
    callbacks: {
        authorized: ({ req, token }: { req: any; token: { role?: string } | null }) => {
            const { pathname } = req.nextUrl;
            if (pathname.startsWith(ROUTES.ADMIN.DASHBOARD)) {
                return !!token && token.role === "admin";
            }
            if (pathname.startsWith(ROUTES.STAFF.DASHBOARD)) {
                return !!token && token.role === "staff";
            }
            return !!token;
        },
    },
    pages: {
        signIn: ROUTES.AUTH.LOGIN,
    },
};

export const authMatcher = [
    `${ROUTES.ADMIN.DASHBOARD}/:path*`,
    `${ROUTES.STAFF.DASHBOARD}/:path*`
];
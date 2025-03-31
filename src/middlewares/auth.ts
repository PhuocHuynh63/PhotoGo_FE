// middleware.ts
import { ROUTES } from "@/routes";
import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            if (req.nextUrl.pathname.startsWith(ROUTES.ADMIN.DASHBOARD)) {
                return !!token && token.role === "admin";
            }
            return !!token;
        },
    },
    pages: {
        signIn: ROUTES.AUTH.LOGIN,
    },
});

export const config = {
    matcher: [`${ROUTES.ADMIN}/:path*`],
};
import { ROUTES } from "@/routes";
import { AuthError } from "@constants/errors";
import authService from "@services/auth";
import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials) return null;
                const res = await authService.login({
                    email: credentials.email,
                    password: credentials.password,
                }) as { statusCode: number; data: any; message: string };

                switch (res.statusCode) {
                    case 404:
                        throw new Error(res.message || AuthError.USER_NOT_FOUND);
                    case 400:
                        throw new Error(res.message || AuthError.WRONG_CREDENTIALS);
                    case 401:
                        throw new Error(res.message || AuthError.INACTIVE);
                    case 200:
                    case 201:
                        break;

                    default:
                        throw new Error(res.message || "Đăng nhập thất bại");
                }
                const user = {
                    id: res.data.user.id,
                    email: res.data.user.email,
                    role: res.data.user.role,
                    accessToken: res.data.access_token,
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }: any) {
            session.user.id = token.id;
            session.user.role = token.role;
            (session as any).accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: ROUTES.AUTH.LOGIN,
    },
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
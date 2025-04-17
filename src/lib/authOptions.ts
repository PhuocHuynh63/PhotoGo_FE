import { ROUTES } from "@/routes";
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
                }) as { statusCode: number; data: any };

                if ((res.statusCode !== 200 && res.statusCode !== 201) || !res.data?.user) {
                    return null;
                }
                const user = {
                    id: res.data.user.id || res.data.user.email,
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
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }: any) {
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
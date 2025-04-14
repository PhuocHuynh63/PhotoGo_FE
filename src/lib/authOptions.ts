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
                }) as { status: number; data: any };

                if (res.status !== 200) {
                    throw new Error("Invalid credentials");
                }
                const user = res.data;
                if (!user) return null;
                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: any) {
            session.user.role = token.role;
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
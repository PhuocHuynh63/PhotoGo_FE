import { ROUTES } from "@/routes";
import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {

                return null; // Trả về null nếu không hợp lệ
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
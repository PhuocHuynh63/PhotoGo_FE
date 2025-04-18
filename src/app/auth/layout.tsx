import { authOptions } from "@lib/authOptions";
import { ROUTES } from "@routes";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Geist, Geist_Mono } from "next/font/google";
import { redirect } from "next/navigation";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Auth",
    description: "Login to PhotoGo platform",
};

const ROLE_REDIRECT_MAP: Record<string, string> = {
    admin: ROUTES.ADMIN.DASHBOARD,
    staff: ROUTES.STAFF.DASHBOARD,
    user: ROUTES.PUBLIC.HOME,
};

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const role = session?.user?.role?.name;

    //#region If the user is already logged in, redirect to the appropriate dashboard
    if (session) {
        redirect(ROUTES.PUBLIC.HOME);
    }
    //#endregion


    //#region If the user is not logged in, redirect to the appropriate dashboard
    const redirectPath = role ? ROLE_REDIRECT_MAP[role] : null;
    if (redirectPath) {
        redirect(redirectPath);
    }
    //#endregion
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="min-h-screen bg-[rgba(246,172,105,0.2)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </body>
        </html>
    );
}

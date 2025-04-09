import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="min-h-screen bg-[rgba(246,172,105,0.2)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}

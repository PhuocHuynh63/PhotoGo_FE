"use client"

import Sidebar from "@pages/Vendor/Components/Sidebar";
import Header from "@pages/Vendor/Components/Header";

export default function VendorProfileLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <main className="flex min-h-screen mx-auto">
            <Sidebar />
            <div className="flex-1 p-6">
                <Header />
                <div className="mt-10">
                    {children}
                </div>
            </div>
        </main>
    )
}

"use client"

import Sidebar from "@components/Organisms/AdminSidebar";
import Header from "@components/Organisms/AdminStaffHeader";
import { createContext, useContext } from "react";
import { IUser } from "@models/user/common.model";
import { Toaster } from "@components/Atoms/ui/toaster";
import { METADATA } from "../../../types/IMetadata";

// Tạo Session Context
export const SessionContext = createContext<METADATA.ISession | null>(null);

// Hook sử dụng session
export const useSession = () => {
    const session = useContext(SessionContext);
    if (!session) {
        throw new Error("useSession phải được dùng trong SessionProvider");
    }
    return session;
};

export default function AdminLayoutClient({
    children,
    session,
    userData,
}: Readonly<{
    children: React.ReactNode;
    session: METADATA.ISession;
    userData: IUser;
}>) {
    return (
        <SessionContext.Provider value={session}>
            <div className="flex h-screen bg-gray-50/50">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <header className="bg-white px-6 py-3 z-10 border-b border-gray-200">
                        <Header userData={userData} />
                    </header>
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
            <Toaster />
        </SessionContext.Provider>
    )
}

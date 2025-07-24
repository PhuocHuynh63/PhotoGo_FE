"use client"

import { useEffect, useState } from "react"
import Sidebar from "@pages/Vendor/Components/Sidebar";
import Header from "@pages/Vendor/Components/Header";
import { createContext, useContext } from "react";
import { IUser } from "@models/user/common.model";
import { METADATA } from "../../../types/IMetadata";
import { useSetSession } from "@stores/user/selectors";

// Create Session Context
export const SessionContext = createContext<METADATA.ISession | null>(null);

// Create a hook to use session
export const useSession = () => {
    const session = useContext(SessionContext);
    if (!session) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return session;
};

export default function VendorProfileLayoutClient({
    children,
    session,
    userData,
}: Readonly<{
    children: React.ReactNode;
    session: METADATA.ISession;
    userData: IUser;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    /**
     * Set session to the store
     */
    const setSession = useSetSession();
    useEffect(() => {
        setSession(session);
    }, [session, setSession]);
    //-----------------------------End---------------------------------//

    return (
        <SessionContext.Provider value={session}>
            <main className="flex min-h-screen mx-auto">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
                <div className="flex-1 p-6">
                    <Header userData={userData} setSidebarOpen={setSidebarOpen} />
                    <div className="mt-10">
                        {children}
                    </div>
                </div>
            </main>
        </SessionContext.Provider>
    )
}

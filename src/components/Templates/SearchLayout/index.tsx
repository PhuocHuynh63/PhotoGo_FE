'use client'

import Chatbot from "@components/Molecules/Chatbot";

export default function SearchLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            {children}
            <Chatbot />
        </>
    );
}

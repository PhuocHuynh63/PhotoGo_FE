export const dynamic = "force-dynamic";

import Chatbot from "@components/Molecules/Chatbot";

export default async function RootLayout({
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
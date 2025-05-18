import ChatLayoutClient from "@components/Templates/ChatLayout";

export default function ChatLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <ChatLayoutClient>
            {children}
        </ChatLayoutClient>
    );
}

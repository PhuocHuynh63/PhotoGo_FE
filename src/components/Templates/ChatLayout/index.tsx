'use client'

export default function ChatLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="flex min-h-screen bg-white" style={{ background: '' }}>
            {children}
        </div>
    );
}

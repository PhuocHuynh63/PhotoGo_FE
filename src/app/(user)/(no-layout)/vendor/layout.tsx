import VendorProfileLayoutClient from "@components/Templates/VendorProfileLayout"


export default function VendorProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <VendorProfileLayoutClient>
            {children}
        </VendorProfileLayoutClient>
    )
}


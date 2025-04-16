import CheckoutLayoutClient from "@components/Templates/CheckoutLayout";

export default function CheckoutLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <CheckoutLayoutClient>
            {children}
        </CheckoutLayoutClient>
    );
}

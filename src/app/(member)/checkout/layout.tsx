import HeaderCheckout from "@pages/Member/Checkout/Header";
import SummaryInformation from "@pages/Member/Checkout/Right/SummaryInformation";

export default function CheckoutLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="bg-gradient-primary" style={{ background: '' }}>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <HeaderCheckout />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left */}
                    {children}

                    {/* Right */}
                    <SummaryInformation />
                </div>
            </div>
        </div>
    );
}

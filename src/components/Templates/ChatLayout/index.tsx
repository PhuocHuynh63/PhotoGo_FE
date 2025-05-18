'use client'

import FooterAction from "@pages/Member/Checkout/components/FooterAction";
import Header from "@pages/Member/Checkout/components/Header";
import Policy from "@pages/Member/Checkout/components/Policy";
import HeaderCheckout from "@pages/Member/Checkout/Header";
import SummaryInformation from "@pages/Member/Checkout/Right/SummaryInformation";
import { useCheckoutStep } from "@stores/checkout/selectors";

export default function ChatLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const currentStep = useCheckoutStep()

    return (
        <div className="flex min-h-screen bg-white" style={{ background: '' }}>
            {children}
        </div>
    );
}

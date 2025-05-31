'use client'

import FooterAction from "@pages/Member/Checkout/components/FooterAction";
import Header from "@pages/Member/Checkout/components/Header";
import Policy from "@pages/Member/Checkout/components/Policy";
import HeaderCheckout from "@pages/Member/Checkout/Header";
import SummaryInformation from "@pages/Member/Checkout/Right/SummaryInformation";
import { ROUTES } from "@routes";
import { useCheckoutStep } from "@stores/checkout/selectors";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function CheckoutLayoutClient({
    children,
    errorMessage
}: Readonly<{
    children: React.ReactNode;
    errorMessage?: string;
}>) {
    /**
     * Define variables
     */
    const router = useRouter()
    const currentStep = useCheckoutStep()
    //----------------------End----------------------//

    return (
        <div className="bg-gradient-primary" style={{ background: '' }}>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <HeaderCheckout />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border h-fit">

                        {/* Header */}
                        <Header />

                        {/* Step Checkout */}
                        <div className="p-6">
                            <div>
                                {/* Step Indicator */}
                                <div className="grid grid-cols-3 mb-6 text-center font-medium text-sm">
                                    <div className={`${currentStep === 1 ? 'bg-primary text-white' : 'text-gray-500'} py-2 rounded-lg`}>
                                        Phương thức
                                    </div>
                                    <div className={`${currentStep === 2 ? 'bg-primary text-white' : 'text-gray-500'} py-2 rounded-lg`}>
                                        Thông tin
                                    </div>
                                    <div className={`${currentStep === 3 ? 'bg-primary text-white' : 'text-gray-500'} py-2 rounded-lg`}>
                                        Xác nhận
                                    </div>
                                </div>

                                <div>
                                    <Policy />

                                    {/* Content */}
                                    {children}

                                    {/* Footer Actions */}
                                    <FooterAction />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <SummaryInformation />
                </div>
            </div>
        </div>
    );
}

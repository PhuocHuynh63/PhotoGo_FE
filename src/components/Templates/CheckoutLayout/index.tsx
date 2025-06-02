'use client'

import { ICheckoutSessionResponseModel } from "@models/checkoutSession/repsonse.model";
import { IUserResponse } from "@models/user/response.model";
import FooterAction from "@pages/Member/Checkout/components/FooterAction";
import Header from "@pages/Member/Checkout/components/Header";
import Policy from "@pages/Member/Checkout/components/Policy";
import HeaderCheckout from "@pages/Member/Checkout/Header";
import SummaryInformation from "@pages/Member/Checkout/Right/SummaryInformation";
import { useCheckoutStep, useFormBooking, useSetFormBooking } from "@stores/checkout/selectors";
import { useSetUser, useUser } from "@stores/user/selectors";
import { useEffect } from "react";

export default function CheckoutLayoutClient({
    children,
    user,
    checkoutSession
}: Readonly<{
    children: React.ReactNode;
    user: IUserResponse;
    checkoutSession?: ICheckoutSessionResponseModel;
}>) {
    /**
     * Define variables
     */
    const currentStep = useCheckoutStep();
    const setUser = useSetUser();

    useEffect(() => {
        setUser(user.data ?? null);
    }, [user]);
    //----------------------End----------------------//

    /**
     * Set booking form when checkout session is available
     */
    const setBookingForm = useSetFormBooking();
    const formBooking = useFormBooking();
    console.log("CheckoutLayoutClient: formBooking", formBooking);


    useEffect(() => {
        if (checkoutSession) {
            setBookingForm({
                ...formBooking,
                userId: user.data?.id || "",
                service_concept_id: checkoutSession.data?.data.conceptId || "",
                date: checkoutSession.data?.data.date || "",
                time: checkoutSession.data?.data.time || "",
            });
        }

        return () => {
            setBookingForm({
                ...formBooking,
                userId: "",
                service_concept_id: "",
                date: "",
                time: "",
                source_type: "web",
                deposit: 30,
                method: 'payos',
                fullName: "",
                phone: "",
                email: "",
                userNote: "",
            });
        }
    }, [checkoutSession]);
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

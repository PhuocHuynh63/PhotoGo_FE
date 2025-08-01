'use client'

import Header from "@pages/Member/Checkout/components/Header";
import Policy from "@pages/Member/Checkout/components/Policy";
import HeaderCheckout from "@pages/Member/Checkout/Header";
import SummaryInformation from "@pages/Member/Checkout/Right/SummaryInformation";
import { useCheckoutStep, useFormBooking, useSelectDeposit, useSetCheckoutSession, useSetCheckoutStep, useSetFormBooking } from "@stores/checkout/selectors";
import { useSetUser } from "@stores/user/selectors";
import { PAGES } from "../../../types/IPages";
import { useEffect } from "react";
import { useSetServiceConcept, useSetServicePackage } from "@stores/vendor/selectors";
import FooterAction from "@pages/Member/Checkout/components/FooterAction";

export default function CheckoutLayoutClient({
    children,
    user,
    checkoutSession,
    concept,
    servicePackage
}: PAGES.ICheckoutLayoutProps) {
    /**
     * Define variables
     */
    const currentStep = useCheckoutStep();
    const setCurrentStep = useSetCheckoutStep();
    const selectedDeposit = useSelectDeposit();
    const setUser = useSetUser();

    useEffect(() => {
        setUser(user.data ?? null);
    }, [user]);
    //----------------------End----------------------//


    /**
     * Set checkout session when available
     */
    const setCheckoutSession = useSetCheckoutSession();
    useEffect(() => {
        setCheckoutSession(checkoutSession ?? null);
    }, [checkoutSession]);
    //----------------------End----------------------//


    /**
     *  Set service package when available
     */
    const setServicePackage = useSetServicePackage();
    useEffect(() => {
        setServicePackage(servicePackage.data ?? null);
    }, [servicePackage]);
    //----------------------End----------------------//

    /**
     * Set concept when available
     */
    const setConcept = useSetServiceConcept();
    useEffect(() => {
        setConcept(concept.data ?? null);
    }, [concept]);
    //----------------------End----------------------//

    /**
     * Set booking form when checkout session is available
     */
    const setBookingForm = useSetFormBooking();
    const formBooking = useFormBooking();

    useEffect(() => {
        if (checkoutSession) {
            setBookingForm({
                ...formBooking,
                userId: user.data?.id || "",
                bookingType: checkoutSession.conceptRangeType || "",
                serviceConceptId: checkoutSession.conceptId || "",
                locationId: checkoutSession.locationDetails?.id || "",
                date: checkoutSession.singleDayBookingDetails?.date || "",
                time: checkoutSession.singleDayBookingDetails?.time || "",
                schedules: checkoutSession.multiDaysBookingDetails || [],
            });
        }

        return () => {
            setBookingForm({
                ...formBooking,
                userId: "",
                serviceConceptId: "",
                date: "",
                time: "",
                locationId: "",
                sourceType: "trực tiếp",
                depositAmount: 30,
                // method: 'payos',
                fullName: "",
                phone: "",
                email: "",
                userNote: "",
            });
            setServicePackage({
                id: "",
                name: "",
                description: "",
                image: "",
                status: "",
                vendorId: "",
                serviceConcepts: [],
                minPrice: 0,
                maxPrice: 0,
                created_at: "",
                updated_at: "",
                vendor: {
                    slug: "",
                    locations: []
                }
            });
            setConcept({
                id: "",
                name: "",
                description: "",
                images: [],
                price: 0,
                duration: 0,
                serviceTypes: []
            });
            selectedDeposit(30);
            setCurrentStep(1);
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

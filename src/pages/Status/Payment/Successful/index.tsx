'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@components/Organisms/Loading";
import { ROUTES } from "@routes";
import paymentService from "@services/payment";

const PaymentSuccessPage = () => {
    const router = useRouter();


    const handlePaymentSuccess = async () => {
        const params = new URLSearchParams(window.location.search);
        const paymentId = params.get("paymentId");
        const status = params.get("status");
        const code = params.get("code");
        const payosId = params.get("id");
        const cancel = params.get("cancel");
        const orderCode = params.get("orderCode");

        if (!paymentId || !status || !code || !payosId || !cancel || !orderCode) {
            router.push(ROUTES.PUBLIC.HOME);
            return;
        }

        const data = {
            status,
            code,
            id: payosId,
            cancel: Boolean(cancel),
            orderCode
        };

        const response = await paymentService.paymentSuccess(paymentId, data) as { statusCode: number };
        if (response.statusCode === 200) {
            const ordersUrl = `${ROUTES.USER.PROFILE.ORDERS}?id=${payosId}`;
            router.push(ordersUrl);
            return;
        } else {
            router.push(ROUTES.PUBLIC.HOME);
            return;
        }
    }

    useEffect(() => {
        handlePaymentSuccess();
    }, [router]);


    return (
        <LoadingPage />
    )
};

export default PaymentSuccessPage;
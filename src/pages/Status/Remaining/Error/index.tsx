'use client';

import { ROUTES } from '@routes';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const PaymentErrorPage = () => {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const currentPaymentId = params.get("paymentId");
        const status = params.get("status");
        const code = params.get("code");
        const payosId = params.get("id");
        const cancel = params.get("cancel");
        const orderCode = params.get("orderCode");

        if (cancel === 'true') {
            router.push(`${ROUTES.USER.PROFILE.ORDERS}?status=đã hủy`);
        }

    }, [router]);
    return null;
};

export default PaymentErrorPage;
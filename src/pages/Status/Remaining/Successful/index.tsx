'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@routes';
import paymentService from '@services/payment';
import LoadingPage from '@components/Organisms/Loading';
import { METADATA } from '../../../../types/IMetadata'; // Ensure this path is correct

const RemainingSuccessPage = ({ session }: { session: METADATA.ISession }) => {
    const router = useRouter();
    const userId = session?.user?.id;

    const [pageData, setPageData] = useState<{
        paymentId: string | null;
        status: string | null;
        code: string | null;
        payosId: string | null;
        cancel: string | null;
        orderCode: string | null;
    } | null>(null);

    const [loadingApi, setLoadingApi] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const currentPaymentId = params.get("paymentId");
        const status = params.get("status");
        const code = params.get("code");
        const payosId = params.get("id");
        const cancel = params.get("cancel");
        const orderCode = params.get("orderCode");

        setPageData({
            paymentId: currentPaymentId,
            status,
            code,
            payosId,
            cancel,
            orderCode,
        });

        const processPayment = async () => {
            if (currentPaymentId && status && code && payosId && cancel !== null && orderCode) {
                const data = {
                    status,
                    code,
                    id: payosId,
                    cancel: cancel === 'true',
                    orderCode
                };
                await paymentService.paymentSuccess(currentPaymentId, data);
                const ordersUrl = `${ROUTES.USER.PROFILE.ORDERS}?message=Thanh toán số tiền còn lại thành công&cancel=false`;
                router.push(ordersUrl);
            } else {
                router.push(ROUTES.PUBLIC.HOME);
            }
        };

        processPayment();
    }, [router, userId]);

    if (loadingApi || pageData === null) {
        return <LoadingPage />;
    }
    return null;
};

export default RemainingSuccessPage;
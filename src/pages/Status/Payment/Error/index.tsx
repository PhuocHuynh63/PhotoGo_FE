'use client';

import { ROUTES } from '@routes';
import paymentService from '@services/payment';
import { usePaymentError } from '@utils/hooks/usePayment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { use, useEffect } from 'react';

const PaymentErrorPage = () => {
    const router = useRouter();

    useEffect(() => {
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
            paymentId,
            status,
            code,
            id: payosId,
            cancel,
            orderCode
        };

        const res = paymentService.paymentError(data) as any;
        console.log('Payment Error Response:', res);



        console.log(`Payment Error Page Loaded with params:
        Payment ID: ${paymentId}
        Status: ${status}
        Code: ${code}
        PayOS ID: ${payosId}
        Cancel: ${cancel}
        Order Code: ${orderCode}`);

    }, [router]);


    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 50%, #fef2f2 100%)'
            }}
        >
            <div className="max-w-md w-full">
                {/* Failure Card */}
                <div
                    className="bg-white rounded-2xl shadow-xl p-8 text-center"
                    style={{
                        animation: 'fadeInUp 0.8s ease-out'
                    }}
                >
                    {/* Error Icon */}
                    <div
                        className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6"
                        style={{
                            animation: 'shake 0.5s ease-in-out'
                        }}
                    >
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>

                    {/* Failure Message */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Đặt Lịch Không Thành Công
                    </h1>

                    <p className="text-gray-600 text-lg mb-6">
                        Rất tiếc, đã có lỗi xảy ra trong quá trình đặt lịch. Vui lòng thử lại hoặc liên hệ với chúng tôi.
                    </p>

                    {/* Error Details */}
                    <div className="space-y-3 mb-8">
                        <div className="bg-red-50 rounded-xl p-4 flex items-center">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.382 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">Lỗi kết nối mạng</span>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-4 flex items-center">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">Vui lòng kiểm tra thông tin</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">

                        <div className="flex space-x-3">
                            <Link
                                href={ROUTES.PUBLIC.HOME}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                            >
                                Về Trang Chủ
                            </Link>

                            <Link
                                href={ROUTES.PUBLIC.CONTACT}
                                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                            >
                                Liên Hệ
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm mb-2">
                        Cần hỗ trợ ngay? Gọi hotline: {' '}
                        <span
                            className="text-red-600 hover:text-red-700 font-medium"
                        >
                            0394959607
                        </span>
                    </p>
                    <p className="text-gray-400 text-xs">
                        Hoặc email: photogoagency.contact@gmail.com
                    </p>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default PaymentErrorPage;
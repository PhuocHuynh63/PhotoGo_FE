'use client'

import React, { useRef, useState, useEffect } from "react";

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    className?: string;
}

function AnimatedNumber({ value, duration = 1500, className = "" }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);

                    const startTime = performance.now();
                    const animate = (currentTime: number) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);

                        setDisplayValue(Math.floor(progress * value));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setDisplayValue(value);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.1 },
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [value, duration, isVisible]);

    return (
        <span ref={elementRef} className={className}>
            {formatCurrency(displayValue)}
        </span>
    );
}

interface PaymentCardProps {
    isVisible?: boolean;
    invoice: {
        originalPrice: number;
        discountAmount: number;
        taxAmount: number;
        feeAmount: number;
        paidAmount: number;
        remainingAmount: number;
        payablePrice: number;
    };
}

const PaymentCard: React.FC<PaymentCardProps> = ({ isVisible, invoice }) => (
    <div
        id="payment-card"
        data-animate
        className={`lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Chi tiết thanh toán</h3>
        <div className="space-y-4 text-gray-700">
            <div className="flex justify-between items-center">
                <span>Giá gốc</span>
                <AnimatedNumber value={invoice?.originalPrice} className="font-medium" />
            </div>
            <div className="flex justify-between items-center">
                <span>Giảm giá</span>
                <AnimatedNumber value={invoice?.discountAmount} className="font-medium" />
            </div>
            <div className="flex justify-between items-center text-blue-600">
                <span>Thuế</span>
                <AnimatedNumber value={invoice?.taxAmount} className="font-medium" />
            </div>
            <div className="flex justify-between items-center text-gray-600">
                <span>Phí dịch vụ</span>
                <AnimatedNumber value={invoice?.feeAmount} className="font-medium" />
            </div>
            <div className="flex justify-between items-center text-green-600">
                <span>Đã thanh toán</span>
                <AnimatedNumber value={invoice?.paidAmount} className="font-semibold" />
            </div>
            <div className="flex justify-between items-center text-red-600">
                <span>Còn lại</span>
                <AnimatedNumber value={invoice?.remainingAmount} className="font-semibold" />
            </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-gray-900">
                <span className="text-xl font-bold">Tổng cộng</span>
                <AnimatedNumber
                    value={invoice?.payablePrice}
                    className="text-3xl font-extrabold text-[#c09a5b]"
                    duration={2000}
                />
            </div>
        </div>
    </div>
);

export default PaymentCard; 
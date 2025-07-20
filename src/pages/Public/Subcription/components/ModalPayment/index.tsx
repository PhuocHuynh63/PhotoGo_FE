'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Check, Star, Calendar, Tag, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Button from '@components/Atoms/Button'
import { ISubscriptionCreatePaymentLinkRequestModel } from '@models/subcription/request.model'
import { useSession } from '@stores/user/selectors'
import { subscriptionService } from '@services/subcription'

// PayOS type declaration
declare global {
    interface Window {
        PayOS?: {
            openPaymentDialog: (config: {
                url: string;
                onSuccess: (data: unknown) => void;
                onError: (error: unknown) => void;
                onClose: () => void;
            }) => void;
        };
    }
}

interface SubscriptionData {
    id: string;
    name: string;
    description: string;
    price: string;
    priceForMonth: string;
    priceForYear: string;
    unit: string;
    billingCycle: string;
    planType: string;
    isActive: boolean;
    recommended: boolean;
    imageUrl?: string;
    icon?: React.ReactNode;
    createdAt: string;
    updatedAt: string;
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscription: SubscriptionData;
}

export default function PaymentModal({
    isOpen,
    onClose,
    subscription,
}: PaymentModalProps) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { opacity: 0, scale: 0.95, y: 50, transition: { duration: 0.2 } },
    };

    const session = useSession();
    const { handleSubmit, setValue } = useForm<ISubscriptionCreatePaymentLinkRequestModel>({
        defaultValues: {
            userId: session?.user?.id || '',
            planId: subscription?.id || '',
            type: 'thanh toán đầy đủ',
        }
    });

    // Reset form values khi subscription thay đổi
    React.useEffect(() => {
        setValue('userId', session?.user?.id || '');
        setValue('planId', subscription?.id || '');
        setValue('type', 'thanh toán đầy đủ');
        setError(null);
        setPaymentUrl(null);
        setShowPaymentDialog(false);
    }, [subscription, session, setValue]);

    // Load PayOS script
    useEffect(() => {
        if (showPaymentDialog && paymentUrl) {
            const script = document.createElement('script');
            script.src = 'https://pay.payos.vn/v2/pay.js';
            script.async = true;
            script.onload = () => {
                // Initialize PayOS dialog
                if (window.PayOS) {
                    window.PayOS.openPaymentDialog({
                        url: paymentUrl,
                        onSuccess: (data: unknown) => {
                            console.log('Payment success:', data);
                            onClose();
                            // Có thể thêm toast notification hoặc redirect
                        },
                        onError: (error: unknown) => {
                            console.error('Payment error:', error);
                            setError('Thanh toán thất bại. Vui lòng thử lại.');
                            setShowPaymentDialog(false);
                        },
                        onClose: () => {
                            setShowPaymentDialog(false);
                        }
                    });
                }
            };
            document.head.appendChild(script);

            return () => {
                // Cleanup script
                const existingScript = document.querySelector('script[src="https://pay.payos.vn/v2/pay.js"]');
                if (existingScript) {
                    existingScript.remove();
                }
            };
        }
    }, [showPaymentDialog, paymentUrl, onClose]);

    const onSubmit = async (data: ISubscriptionCreatePaymentLinkRequestModel) => {
        if (!session?.user?.id) {
            setError('Vui lòng đăng nhập để tiếp tục');
            return;
        }
        console.log(data)
        setIsLoading(true);
        setError(null);

        try {
            const response = await subscriptionService.createPaymentLink(data);

            const responseData = response as { data?: { paymentUrl?: string } };
            if (responseData?.data?.paymentUrl) {
                // Set payment URL and show dialog
                setPaymentUrl(responseData.data.paymentUrl);
                setShowPaymentDialog(true);
            } else {
                setError('Không thể tạo liên kết thanh toán. Vui lòng thử lại.');
            }
        } catch (err: unknown) {
            console.error('Payment link creation error:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : 'Có lỗi xảy ra khi tạo liên kết thanh toán. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    // Parse HTML description to extract features
    const parseFeatures = (htmlDescription: string): string[] => {
        if (!htmlDescription) return [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlDescription, 'text/html');
        const listItems = doc.querySelectorAll('li');
        return Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
    };

    const features = parseFeatures(subscription?.description);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-400 bg-opacity-100 backdrop-blur-sm p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto mt-16 sm:mt-0"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Nút đóng modal */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
                            aria-label="Đóng"
                            disabled={isLoading}
                        >
                            <X size={24} />
                        </button>

                        <div className="p-4 sm:p-6 lg:p-8">
                            {/* Header */}
                            <div className="text-center mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Chi tiết gói đăng ký</h2>
                                <p className="text-sm sm:text-base text-gray-500">Xem lại thông tin trước khi thanh toán</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Subscription Details */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                                    <div className="flex items-center space-x-3">
                                        {subscription.icon && (
                                            <div className="text-blue-600">
                                                {subscription.icon}
                                            </div>
                                        )}
                                        <div className="flex-1 items-center justify-center">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">{subscription.name}</h3>
                                            {subscription.recommended && (
                                                <div className="flex items-center mt-1">
                                                    <Star size={14} className="text-yellow-500 fill-current" />
                                                    <span className="text-xs text-yellow-600 ml-1 font-medium">Gói được khuyến nghị</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right flex items-end justify-center">
                                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{subscription.price}</div>
                                        <div className="text-sm text-gray-500">{subscription.unit}</div>
                                    </div>
                                </div>

                                {/* Plan Type and Billing Cycle */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mb-4 gap-2">
                                    <div className="flex items-center space-x-2">
                                        <Tag size={16} className="text-gray-400 flex-shrink-0" />
                                        <span>Loại: <span className="font-medium">{subscription.planType}</span></span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                                        <span>Chu kỳ: <span className="font-medium">{subscription.billingCycle}</span></span>
                                    </div>
                                </div>

                                {/* Price Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                    <div className="bg-white rounded-lg p-3">
                                        <div className="text-gray-500">Giá theo tháng</div>
                                        <div className="font-semibold text-gray-800">{subscription.priceForMonth} ₫</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3">
                                        <div className="text-gray-500">Giá theo năm</div>
                                        <div className="font-semibold text-gray-800">{subscription.priceForYear} ₫</div>
                                    </div>
                                </div>
                            </div>

                            {/* Features List */}
                            {features.length > 0 && (
                                <div className="mb-4 sm:mb-6">
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Tính năng bao gồm:</h4>
                                    <div className="space-y-2">
                                        {features.map((feature, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payment Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Payment Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={16} className="mr-2 flex-shrink-0 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={16} className="mr-2 flex-shrink-0" />
                                            Thanh toán {subscription.price}
                                        </>
                                    )}
                                </Button>

                                {/* Security Notice */}
                                <div className="text-center text-xs text-gray-500 mt-3 sm:mt-4">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Lock size={12} className="text-gray-400 flex-shrink-0" />
                                        <span>Thanh toán được bảo mật bởi SSL</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
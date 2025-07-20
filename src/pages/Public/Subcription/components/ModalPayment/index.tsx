'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Mail, User, CreditCard } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Button from '@components/Atoms/Button'
import { ISubscriptionCreatePaymentLinkRequestModel } from '@models/subcription/request.model'

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productPrice: string;
}

export const PaymentModal = ({
    isOpen,
    onClose,
    productName,
    productPrice,
}: PaymentModalProps) => {

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { opacity: 0, scale: 0.95, y: 50, transition: { duration: 0.2 } },
    };


    /**
     * This is the form for the payment modal
     * @description Form
     */
    const { register, handleSubmit, formState: { errors } } = useForm<ISubscriptionCreatePaymentLinkRequestModel>();

    const onSubmit = (data: ISubscriptionCreatePaymentLinkRequestModel) => {
        console.log(data);
    }
    //-------------------------------End-------------------------------//

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 bg-opacity-100 backdrop-blur-sm"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="relative bg- bg-white w-full max-w-md rounded-xl shadow-2xl m-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Nút đóng modal */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Đóng"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Thanh toán an toàn</h2>
                            <p className="text-center text-gray-500 mb-6">Thanh toán cho gói: <span className="font-semibold text-blue-600">{productName}</span></p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* UserId */}
                                <input type="hidden" {...register('userId')} className="w-full pl-10 pr-3 py-2.5 border" />

                                {/* PlanId */}
                                <input type="hidden" {...register('planId')} className="w-full pl-10 pr-3 py-2.5 border" />

                                {/* type */}
                                <input type="hidden" {...register('type')} className="w-full pl-10 pr-3 py-2.5 border" />

                                {/* Nút thanh toán */}
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    <Lock size={18} className="mr-2" />
                                    Thanh toán {productPrice}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
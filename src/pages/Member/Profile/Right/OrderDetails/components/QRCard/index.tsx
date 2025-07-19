'use client'

import React from "react";
import { QRCodeSVG } from 'qrcode.react';
import { motion } from "framer-motion";
import clsx from 'clsx';
import { BOOKING } from "@constants/booking";

interface QRCardProps {
    isVisible?: boolean;
    code: string;
    qrURL: string;
    status?: string;
}

const QRCard: React.FC<QRCardProps> = ({
    isVisible,
    code,
    qrURL,
    status
}) => {
    const isCancelled = status === BOOKING.BOOKING_STATUS.CANCELLED ||
        status === BOOKING.BOOKING_STATUS.CANCELLED_USER ||
        status === BOOKING.BOOKING_STATUS.CANCELLED_VENDOR ||
        status === BOOKING.BOOKING_STATUS.CANCELLED_TIMEOUT;

    return (
        <div
            id="qr-card"
            data-animate
            className={clsx(
                "text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-700 ease-out relative",
                {
                    "bg-gray-900": !isCancelled,
                    "bg-slate-800": isCancelled,
                    "opacity-100 translate-y-0": isVisible,
                    "opacity-0 translate-y-5": !isVisible,
                }
            )}
        >
            <h3 className="text-xl font-bold">
                {isCancelled ? "Check-in Pass (Đã Hủy)" : "Check-in Pass"}
            </h3>
            <p className="text-sm opacity-80 mt-1 mb-4 h-10">
                {isCancelled
                    ? "Mã QR này không còn hợp lệ."
                    : "Dùng mã này để check-in tại studio."
                }
            </p>

            {/* Vùng chứa QR code với con dấu "Đã Hủy" */}
            <div className="relative w-[184px] h-[184px] flex items-center justify-center">
                <div className={clsx(
                    "bg-white p-3 rounded-lg transition-all duration-500",
                    { "opacity-20 grayscale": isCancelled }
                )}>
                    <QRCodeSVG value={qrURL} size={160} />
                </div>
                {isCancelled && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                        animate={{ opacity: 1, scale: 1, rotate: -15 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        <span
                            className="text-red-500 font-black text-3xl tracking-wider uppercase select-none border-4 border-red-500 rounded-lg px-4 py-1"
                            style={{ textShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)' }}
                        >
                            Đã Hủy
                        </span>
                    </motion.div>
                )}
            </div>

            <p className={clsx(
                "mt-4 font-mono font-bold text-2xl tracking-widest transition-all",
                { "line-through text-slate-400": isCancelled }
            )}>
                {code}
            </p>
        </div>
    );
};

export default QRCard;

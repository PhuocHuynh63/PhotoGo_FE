'use client'

import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Camera, PartyPopper, CircleX } from "lucide-react";
import clsx from 'clsx';
import { BOOKING } from "@constants/booking";

const ICONS = {
    [BOOKING.BOOKING_STATUS.PENDING]: <Clock className="w-6 h-6" />,
    [BOOKING.BOOKING_STATUS.CONFIRMED]: <CheckCircle2 className="w-6 h-6" />,
    [BOOKING.BOOKING_STATUS.IN_PROGRESS]: <Camera className="w-6 h-6" />,
    [BOOKING.BOOKING_STATUS.COMPLETED]: <PartyPopper className="w-6 h-6" />,
    [BOOKING.BOOKING_STATUS.CANCELLED]: <CircleX className="w-6 h-6" />,
};

interface TimelineCardProps {
    isVisible?: boolean;
    allPossibleStatuses: string[];
    completedStatuses: string[];
    currentStatusIndex: number;
    status: any;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
    isVisible,
    allPossibleStatuses,
    completedStatuses,
    currentStatusIndex,
    status
}) => {

    /**
     * Check if the current order is cancelled
     */
    const isOrderCancelled = [
        BOOKING.BOOKING_STATUS.CANCELLED,
        BOOKING.BOOKING_STATUS.CANCELLED_USER,
        BOOKING.BOOKING_STATUS.CANCELLED_VENDOR,
        BOOKING.BOOKING_STATUS.CANCELLED_TIMEOUT
    ].includes(status);
    //-------------------------End-------------------------//

    /**
     * Filter statuses to display based on cancellation status
     */
    const statusesToDisplay = isOrderCancelled
        ? allPossibleStatuses
        : allPossibleStatuses?.filter(s => s !== BOOKING.BOOKING_STATUS.CANCELLED);
    //-------------------------End-------------------------//

    return (
        <div
            id="timeline-card"
            data-animate
            className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">Lộ trình thực hiện</h3>
            <div className="flex justify-between items-start">
                {statusesToDisplay?.map((itemStatus, index) => {

                    // Logic cho trạng thái Bị Hủy
                    if (isOrderCancelled) {
                        const isTheCancelledStep = itemStatus === BOOKING.BOOKING_STATUS.CANCELLED;
                        const iconBg = isTheCancelledStep
                            ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg ring-4 ring-red-200"
                            : "bg-gray-200 text-gray-400";
                        const labelColor = isTheCancelledStep
                            ? "text-red-600 font-extrabold"
                            : "text-gray-400 font-semibold";

                        return (
                            <div key={itemStatus} className="relative flex-1 text-center">
                                {index > 0 && (
                                    <div className="absolute top-[22px] right-1/2 h-1 w-full bg-gray-200 -z-10" />
                                )}
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center relative z-10 border-4 border-white transition-all duration-500 ${iconBg}`}>
                                            {ICONS[itemStatus as keyof typeof ICONS] || <div />}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className={`text-sm capitalize transition-colors ${labelColor}`}>
                                            {itemStatus}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // Logic cho các trạng thái Bình Thường
                    const isCompleted = completedStatuses.includes(itemStatus);
                    const isActive = index === currentStatusIndex;

                    const iconBg = clsx({
                        "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg ring-4 ring-yellow-200 animate-pulse": isActive,
                        "bg-gradient-to-br from-yellow-400 to-amber-500 text-white": isCompleted && !isActive,
                        "bg-gray-200 text-gray-500": !isCompleted,
                    });

                    const labelColor = clsx("font-semibold text-sm capitalize transition-colors", {
                        "text-yellow-600 font-extrabold": isActive,
                        "text-gray-800": isCompleted && !isActive,
                        "text-gray-400": !isCompleted,
                    });

                    const showCompletedLine = index <= currentStatusIndex;

                    return (
                        <div key={itemStatus} className="relative flex-1 text-center">
                            {index > 0 && (
                                <div className="absolute top-[22px] right-1/2 h-1 w-full -z-10">
                                    <div className="bg-gray-200 h-full w-full" />
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: showCompletedLine ? 1 : 0 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="absolute top-0 left-0 h-full w-full origin-left bg-gradient-to-r from-yellow-400 to-amber-500"
                                    />
                                </div>
                            )}
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center relative z-10 border-4 border-white transition-all duration-500 ${iconBg}`}>
                                        {ICONS[itemStatus as keyof typeof ICONS] || <div />}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className={labelColor}>
                                        {itemStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineCard;

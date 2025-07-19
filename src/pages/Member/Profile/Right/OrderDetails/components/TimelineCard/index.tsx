'use client'

import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Camera, PartyPopper, CircleX } from "lucide-react";
import clsx from 'clsx';

// Sử dụng Lucide-React icons cho giao diện hiện đại và nhất quán
const ICONS = {
    'chờ xác nhận': <Clock className="w-6 h-6" />,
    'đã xác nhận': <CheckCircle2 className="w-6 h-6" />,
    'đang thực hiện': <Camera className="w-6 h-6" />,
    'đã hoàn thành': <PartyPopper className="w-6 h-6" />,
    'đã huỷ': <CircleX className="w-6 h-6" />,
};

interface TimelineCardProps {
    isVisible?: boolean;
    allPossibleStatuses: string[];
    completedStatuses: string[];
    currentStatusIndex: number;
    // status có thể là một trong các giá trị của allPossibleStatuses
    status: string;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
    isVisible,
    allPossibleStatuses,
    completedStatuses,
    currentStatusIndex,
    
}) => {
    
    const isOrderCancelled = status.toLowerCase() === 'đã huỷ';
    const cancelledStatusName = allPossibleStatuses.find(s => s.toLowerCase() === 'đã huỷ');

    return (
        <div
            id="timeline-card"
            data-animate
            className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">Lộ trình thực hiện</h3>
            <div className="flex justify-between items-start">
                {allPossibleStatuses?.map((itemStatus, index) => {
                    const isCompleted = completedStatuses?.includes(itemStatus) && !isOrderCancelled;
                    const isActive = index === currentStatusIndex && !isOrderCancelled;
                    const isCancelledStep = itemStatus === cancelledStatusName;

                    // Logic xác định trạng thái của một bước trong timeline khi đơn bị huỷ
                    const isStepBeforeCancellation = isOrderCancelled && completedStatuses?.includes(itemStatus);
                    const isFutureStepInCancelledOrder = isOrderCancelled && !completedStatuses?.includes(itemStatus) && !isCancelledStep;

                    const iconBg = clsx({
                        // Trạng thái bị huỷ
                        "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg ring-4 ring-red-200": isCancelledStep && isOrderCancelled,
                        // Trạng thái đang hoạt động (active)
                        "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg ring-4 ring-yellow-200 animate-pulse": isActive,
                        // Trạng thái đã hoàn thành (trong một flow bình thường)
                        "bg-gradient-to-br from-yellow-400 to-amber-500 text-white": isCompleted,
                        // Trạng thái đã hoàn thành (trong một flow bị huỷ)
                        "bg-gradient-to-br from-slate-500 to-slate-600 text-white": isStepBeforeCancellation,
                        // Trạng thái mặc định (chưa tới)
                        "bg-gray-200 text-gray-500": !isCompleted && !isActive && !isOrderCancelled,
                        // Trạng thái chưa tới (trong một flow bị huỷ)
                        "bg-gray-200 text-gray-400": isFutureStepInCancelledOrder,
                    });

                    const labelColor = clsx("font-semibold text-sm capitalize transition-colors", {
                        "text-red-600 font-extrabold": isCancelledStep && isOrderCancelled,
                        "text-yellow-600 font-extrabold": isActive,
                        "text-gray-800": isCompleted || isStepBeforeCancellation,
                        "text-gray-400": !isCompleted && !isActive || isFutureStepInCancelledOrder,
                    });

                    const showCompletedLine = isCompleted || (isOrderCancelled && completedStatuses.includes(allPossibleStatuses[index]));

                    return (
                        <div key={itemStatus} className="relative flex-1 text-center">
                            {index > 0 && (
                                <div className="absolute top-[22px] right-1/2 h-1 w-full -z-10">
                                    {/* Base line */}
                                    <div className="bg-gray-200 h-full w-full" />
                                    {/* Animated progress line */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: showCompletedLine ? 1 : 0 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className={clsx(
                                            "absolute top-0 left-0 h-full w-full origin-left",
                                            {
                                                "bg-gradient-to-r from-yellow-400 to-amber-500": isCompleted,
                                                "bg-gradient-to-r from-slate-500 to-slate-600": isStepBeforeCancellation,
                                            }
                                        )}
                                    />
                                </div>
                            )}
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center relative z-10 border-4 border-white transition-all duration-500 ${iconBg}`}>
                                        {ICONS[itemStatus.toLowerCase() as keyof typeof ICONS] || <div />}
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

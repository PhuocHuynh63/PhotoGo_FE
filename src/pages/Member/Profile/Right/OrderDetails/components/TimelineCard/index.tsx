'use client'

import React from "react";
import { motion } from "framer-motion";
const ICONS = {
    "chờ xử lý": (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    ),
    "đã xác nhận": (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    ),
    "đang thực hiện": (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
        </svg>
    ),
    "hoàn thành": (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
    ),
};

interface TimelineCardProps {
    isVisible?: boolean;
    allPossibleStatuses: string[];
    completedStatuses: string[];
    currentStatusIndex: number;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ isVisible, allPossibleStatuses, completedStatuses, currentStatusIndex }) => (
    <div
        id="timeline-card"
        data-animate
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
        <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">Lộ trình thực hiện</h3>
        <div className="flex justify-between items-start">
            {allPossibleStatuses?.map((status, index) => {
                const isCompleted = completedStatuses?.includes(status);
                const isActive = index === currentStatusIndex;
                const iconBg = isCompleted
                    ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
                    : "bg-gray-200 text-gray-500";

                return (
                    <div key={status} className="relative flex-1">
                        {index > 0 && (
                            <motion.div
                                initial={{
                                    transform: "scaleX(0)",
                                    transformOrigin: "left",
                                }}
                                animate={{
                                    transform: isCompleted ? "scaleX(1)" : "scaleX(0)",
                                    transformOrigin: "left",
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeInOut",
                                }}
                                className={`absolute top-[22px] right-1/2 h-1 w-full bg-gray-200 -z-10 transition-all duration-800 ease-out ${isCompleted ? "bg-gradient-to-r from-yellow-400 to-amber-500" : ""}`}
                            />
                        )}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                {isActive && (
                                    <div className="absolute inset-0 w-11 h-11 rounded-full ring-4 ring-yellow-200 animate-pulse transition-all duration-300 ease-out scale-110" />
                                )}
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center relative z-10 border-4 border-[#fdfdfd] transition-all duration-500 ${iconBg} ${isActive ? "ring-4 ring-yellow-200" : ""}`}
                                >
                                    {ICONS[status as keyof typeof ICONS]}
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <p
                                    className={`font-semibold text-sm capitalize ${isCompleted ? "text-gray-800" : "text-gray-400"}`}
                                >
                                    {status}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default TimelineCard; 
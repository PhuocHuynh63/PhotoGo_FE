"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { CircleX } from "lucide-react";
import { BOOKING } from "@constants/booking";

interface CountdownCardProps {
    isVisible?: boolean;
    targetDate: number;
    isMultiDay?: boolean;
    bookingDate?: string;
    bookingTime?: string;
    status?: any;
}

const CountdownCard: React.FC<CountdownCardProps> = ({
    isVisible,
    targetDate,
    isMultiDay = false,
    bookingDate,
    bookingTime,
    status
}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    /**
     * Check if the current order 
     * - Cancelled
     * - In Progress
     * - Completed
     * 
     */
    const isOrderCancelled = [
        BOOKING.BOOKING_STATUS.CANCELLED,
        BOOKING.BOOKING_STATUS.CANCELLED_USER,
        BOOKING.BOOKING_STATUS.CANCELLED_VENDOR,
        BOOKING.BOOKING_STATUS.CANCELLED_TIMEOUT
    ].includes(status);

    const isOrderInProgress = status === BOOKING.BOOKING_STATUS.IN_PROGRESS;
    const isOrderCompleted = status === BOOKING.BOOKING_STATUS.COMPLETED;
    //-------------------------End-------------------------//


    // UI: Giao diện khi đơn hàng/buổi chụp bị hủy
    if (isOrderCancelled) {
        return (
            <motion.div
                id="countdown-card-cancelled"
                variants={cardVariants}
                className="lg:col-span-2 flex items-center justify-center bg-red-50/50 border border-red-200 rounded-2xl shadow-lg p-8"
            >
                <div className="text-center flex flex-col items-center">
                    <CircleX className="w-16 h-16 text-red-500 mb-4" strokeWidth={1.5} />
                    <h3 className="text-2xl font-bold mb-2 text-red-800">
                        {isMultiDay ? "Dịch vụ đã bị hủy" : "Buổi chụp đã bị hủy"}
                    </h3>
                    <p className="text-slate-600 mt-2 max-w-md">
                        {isMultiDay
                            ? <>Dịch vụ của bạn dự kiến bắt đầu vào ngày <strong>{bookingDate}</strong> đã không thể thực hiện.</>
                            : <>Buổi chụp của bạn vào lúc <strong>{bookingTime}</strong> ngày <strong>{bookingDate}</strong> đã không thể thực hiện.</>
                        }
                    </p>
                </div>
            </motion.div>
        );
    }

    // UI: Giao diện khi đơn hàng/buổi chụp đang diễn ra
    if (isOrderInProgress) {
        return (
            <motion.div
                id="countdown-card-inprogress"
                variants={cardVariants}
                className="lg:col-span-2 flex items-center justify-center bg-blue-50/50 border border-blue-200 rounded-2xl shadow-lg p-8"
            >
                <div className="text-center flex flex-col items-center">
                    <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <h3 className="text-2xl font-bold mb-2 text-blue-800">
                        {isMultiDay ? "Dịch vụ đang diễn ra" : "Buổi chụp đang diễn ra"}
                    </h3>
                    <p className="text-slate-600 mt-2 max-w-md">
                        {isMultiDay
                            ? <>Dịch vụ của bạn đã bắt đầu từ ngày <strong>{bookingDate}</strong> và đang được thực hiện.</>
                            : <>Buổi chụp của bạn vào lúc <strong>{bookingTime}</strong> ngày <strong>{bookingDate}</strong> đang được thực hiện.</>
                        }
                    </p>
                </div>
            </motion.div>
        );
    }

    // UI: Giao diện khi đơn hàng/buổi chụp đã hoàn thành
    if (isOrderCompleted) {
        return (
            <motion.div
                id="countdown-card-completed"
                variants={cardVariants}
                className="lg:col-span-2 flex items-center justify-center bg-green-50/50 border border-green-200 rounded-2xl shadow-lg p-8"
            >
                <div className="text-center flex flex-col items-center">
                    <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M9 12l2 2l4 -4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <h3 className="text-2xl font-bold mb-2 text-green-800">
                        {isMultiDay ? "Dịch vụ đã hoàn thành" : "Buổi chụp đã hoàn thành"}
                    </h3>
                    <p className="text-slate-600 mt-2 max-w-md">
                        {isMultiDay
                            ? <>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Hy vọng bạn đã có trải nghiệm tuyệt vời!</>
                            : <>Buổi chụp của bạn đã hoàn thành. Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi!</>
                        }
                    </p>
                </div>
            </motion.div>
        );
    }

    //UI: Đơn hàng/buổi chụp sắp diễn ra
    return (
        <div
            id="countdown-card"
            data-animate
            className={`lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
                {isMultiDay
                    ? "Dịch vụ nhiều ngày của bạn sắp bắt đầu!"
                    : "Buổi chụp của bạn sắp diễn ra!"
                }
            </h3>
            <p className="text-gray-500 mb-6">
                {isMultiDay
                    ?
                    <>
                        Dịch vụ sẽ bắt đầu từ ngày <strong>{bookingDate}</strong>. Chúng tôi rất mong được đón tiếp bạn.
                    </>
                    : (
                        <>
                            Buổi chụp vào lúc <strong>{bookingTime}</strong> ngày <strong>{bookingDate}</strong>. Chúng tôi rất mong được đón tiếp bạn.
                        </>
                    )
                }
            </p>

            <div className="flex justify-center items-center gap-4 text-white p-4 rounded-xl bg-gradient-to-br from-gray-700 to-gray-600">
                {isClient && targetDate && (
                    <FlipClockCountdown
                        to={targetDate}
                        labels={['Ngày', 'Giờ', 'Phút', 'Giây']}
                        labelStyle={{ fontSize: 12, fontWeight: 500, color: "#fff" }}
                        digitBlockStyle={{ width: 40, height: 60, fontSize: 36 }}
                        showSeparators
                    />
                )}
            </div>

            <div className="mt-6">
                <p className="font-bold">Một vài lưu ý nhỏ:</p>
                <ul className="list-disc list-inside text-gray-600 mt-2 text-sm space-y-1">
                    {isMultiDay ? (
                        <>
                            <li>Hãy chuẩn bị đầy đủ trang phục cho các ngày chụp.</li>
                            <li>Ngủ đủ giấc để có thần thái rạng rỡ nhất trong suốt quá trình.</li>
                            <li>Liên hệ studio để xác nhận lại lịch trình chi tiết.</li>
                            <li>Chuẩn bị tinh thần cho một trải nghiệm tuyệt vời kéo dài nhiều ngày.</li>
                        </>
                    ) : (
                        <>
                            <li>Hãy đến sớm 15 phút để chuẩn bị tốt nhất.</li>
                            <li>Ngủ đủ giấc để có thần thái rạng rỡ nhất.</li>
                            <li>Mang theo trang phục hoặc phụ kiện cá nhân nếu muốn.</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CountdownCard;

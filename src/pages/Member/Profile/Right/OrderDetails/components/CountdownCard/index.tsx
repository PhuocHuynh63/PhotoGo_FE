"use client"

import React, { useEffect, useState } from "react";

import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

interface CountdownCardProps {
    isVisible?: boolean;
    targetDate: number;
    isMultiDay?: boolean;
    bookingDate?: string;
    bookingTime?: string;
}

const CountdownCard: React.FC<CountdownCardProps> = ({
    isVisible,
    targetDate,
    isMultiDay = false,
    bookingDate,
    bookingTime
}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
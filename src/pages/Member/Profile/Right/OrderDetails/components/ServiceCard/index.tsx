'use client'

import React from "react";

interface ServiceCardProps {
    isVisible?: boolean;
    description: string;
    showFullDescription: boolean;
    setShowFullDescription: (show: boolean) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ isVisible, description, showFullDescription, setShowFullDescription }) => (
    <div
        id="service-card"
        data-animate
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
    >
        <h3 className="text-xl font-bold mb-4 text-gray-800">Gói dịch vụ</h3>
        <div className="text-gray-600 text-sm leading-relaxed">
            <p>
                <div
                    className={`text-muted-foreground prose prose-sm max-w-none text-sm ${!showFullDescription ? 'line-clamp-2' : ''}`}
                    dangerouslySetInnerHTML={{ __html: description || '' }}
                />
            </p>
            {description?.length > 200 && (
                <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="cursor-pointer mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                    {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                </button>
            )}
        </div>
    </div>
);

export default ServiceCard; 
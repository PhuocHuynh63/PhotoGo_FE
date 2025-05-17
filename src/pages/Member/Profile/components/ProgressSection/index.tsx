import React from "react";
import { motion } from "framer-motion";

const ProgressSection = ({ spent = 0, required = 1 }: { spent?: number; required?: number }) => {
    const percent = Math.min((spent / required) * 100, 100);
    return (
        <motion.div
            className="w-full bg-gray-100 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Gói Khởi Động</span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Đạt 0/5 đơn hàng hoặc chi tiêu 0.00/US$ 380.00</span>
            </div>
            <div className="flex justify-between mb-1 text-sm text-gray-600">
                <span>Tiến trình nhận quà</span>
                <span>{percent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full">
                <div className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" style={{ width: `${percent}%` }} />
            </div>
            <div className="mt-4 text-xs text-gray-500">
                Hành trình của bạn bắt đầu vào 2025-04-18 và kết thúc vào 2026-04-18.{" "}
                <a href="#" className="text-blue-500">
                    Xem Điều khoản & Điều kiện
                </a>
            </div>
        </motion.div>
    );
};

export default ProgressSection;

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const BenefitsList = () => {
    return (
        <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-xl font-bold mb-4">Ưu đãi cho thành viên</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {/* Photo Coin Benefit */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" fill="#FCD34D" />
                                    <path
                                        d="M12 6V18M8 10H16"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-medium">Photo Coin</h3>
                        </div>
                        <a href="#" className="text-sm text-blue-500 flex items-center mb-4">
                            Xem thêm về Photo Coin <ChevronRight size={14} />
                        </a>
                        <div className="border-t pt-4">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-xs font-medium">1%</span>
                                </div>
                                <p className="text-sm">Hoàn tiền tới 1% giá trị đơn hàng dưới dạng Photo Coin đối với hạng Bạc</p>
                            </div>
                        </div>
                        <div className="border-t pt-4 mt-4">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-xs font-medium">3%</span>
                                </div>
                                <p className="text-sm">Hoàn tiền tới 3% giá trị đơn hàng dưới dạng Photo Coin đối với hạng Vàng</p>
                            </div>
                            <div className="flex items-center mt-2">
                                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Lv.2 Vàng</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gold Member Benefits */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M20 12V22H4V12"
                                        stroke="#6B7280"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M22 7H2V12H22V7Z"
                                        stroke="#6B7280"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M12 22V7" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path
                                        d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z"
                                        stroke="#6B7280"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z"
                                        stroke="#6B7280"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-medium">Giá ưu đãi cho thành viên</h3>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm">
                                Nhận ưu đãi dành riêng cho thành viên Vàng khi đặt khách sạn, thuê xe hay mua bảo hiểm du lịch
                            </p>
                            <a href="#" className="text-sm text-blue-500 flex items-center mt-2">
                                Tìm hiểu thêm <ChevronRight size={14} />
                            </a>
                        </div>
                        <div className="flex items-center mt-2">
                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Lv.2 Vàng</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BenefitsList;

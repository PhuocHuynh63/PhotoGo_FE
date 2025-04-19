import { ChevronRight, Info } from "lucide-react";

export default function RewardsContent({ user }) {
    return (
        <>
            {/* Photo Rewards Header */}
            <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            fill="#8B5CF6"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-purple-700">
                    PhotoGo <span className="font-normal">Rewards</span>
                </h1>
            </div>

            <p className="text-gray-600 mb-6">Nhận thưởng từ mỗi chuyến du lịch cùng và vận ưu đãi độc quyền</p>

            {/* Membership Levels */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Current Level - Silver */}
                <div className="flex-1 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 text-white">
                        <div className="flex items-center">
                            <div className="bg-white/20 rounded-md px-2 py-1 text-xs">Lv. 1</div>
                            <div className="ml-2 text-sm">Hạng hiện tại</div>
                        </div>
                        <h3 className="text-2xl font-bold mt-4">Bạc</h3>
                        <div className="mt-4 flex items-center">
                            <div className="bg-white/20 rounded-full p-2">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm">
                            <p>
                                Chi tiêu US$ 380.00 (khoảng 9832639.33đ) hoặc hoàn thành tham gia 5 đơn hàng trước 2026-04-18 để lên
                                hạng Vàng
                            </p>
                            <div className="flex items-center mt-1">
                                <Info size={16} className="mr-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Level - Gold */}
                <div className="flex-1 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-white">
                        <div className="flex items-center">
                            <div className="bg-white/20 rounded-md px-2 py-1 text-xs">Lv. 2</div>
                        </div>
                        <h3 className="text-2xl font-bold mt-4">Vàng</h3>
                        <div className="mt-4 flex items-center">
                            <div className="bg-white/20 rounded-full p-2">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 text-sm">
                            <p>Lên hạng Vàng, nhận kho tặng ưu đãi - Đặt đơn càng nhiều, ưu đãi càng lớn!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="mb-8">
                <div className="flex justify-end mb-2">
                    <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                                    stroke="#6B7280"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-600">Lên hạng Vàng</span>
                    </div>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Gói Khởi Động</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Đạt 0/5 đơn hàng hoặc chi tiêu 0.00/US$ 380.00</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(user.spentAmount / user.requiredAmount) * 100}%` }}
                        ></div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        Hành trình của bạn bắt đầu vào 2025-04-18 và kết thúc vào 2026-04-18.{" "}
                        <a href="#" className="text-blue-500">
                            Xem Điều khoản & Điều kiện
                        </a>
                    </div>
                </div>
            </div>

            {/* Member Benefits Section */}
            <div className="mb-8">
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
            </div>
        </>
    )
}
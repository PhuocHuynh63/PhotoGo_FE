import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import React from 'react'

const Confirm = () => {
    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="space-y-8">
                {/* Booking Information */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-6 text-[#f0a06a]">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M16 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 className="font-medium text-lg">Thông tin đặt lịch</h2>
                    </div>

                    <div className="bg-[#fffaf5] rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-gray-500 text-sm mb-1">Dịch vụ</h3>
                                <p className="font-medium">Gói chụp ảnh cưới cao cấp</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm mb-1">Nhà cung cấp</h3>
                                <p className="font-medium">Studio Ánh Dương</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-[#f0a06a]" />
                                <span>12/03/2025</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-[#f0a06a]" />
                                <span>09:00</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-5 w-5 text-[#f0a06a] mt-0.5" />
                                <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-6 text-[#f0a06a]">
                            <Heart className="h-6 w-6" />
                        </div>
                        <h2 className="font-medium text-lg">Thông tin khách hàng</h2>
                    </div>

                    <div className="bg-[#fffaf5] rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-gray-500 text-sm mb-1">Họ và tên</h3>
                                <p className="font-medium">Huỳnh Minh Phước</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm mb-1">Số điện thoại</h3>
                                <p className="font-medium">1900-8686</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-gray-500 text-sm mb-1">Email</h3>
                            <p className="font-medium">phuochmse17830@fpt.edu.vn</p>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-6 text-[#f0a06a]">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 className="font-medium text-lg">Phương thức thanh toán</h2>
                    </div>

                    <div className="bg-[#fffaf5] rounded-xl p-6">
                        <div className="flex items-center gap-3">
                            {/* <CreditCard className="h-6 w-6 text-[#f0a06a]" /> */}
                            <img src="https://payos.vn/docs/img/logo.svg" alt="PayOS Logo" className='h-10 w-10 mr-2' />
                            <div>
                                <div className="font-medium">PayOS</div>
                                <div className="text-sm text-gray-500">Thanh toán qua ví PayOS</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Confirm
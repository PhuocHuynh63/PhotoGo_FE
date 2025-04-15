'use client'

import Button from '@components/Atoms/Button'
import Input from '@components/Atoms/Input'
import { Separator } from '@components/Atoms/Seperator/Seperator'
import { ArrowRight, Calendar, Clock, CreditCard, Info, Shield, Star } from 'lucide-react'
import React from 'react'

const CheckoutPage = () => {
    return (
        <>
            {/* Left Column - Payment Options */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
                <div className="bg-gradient-secondary p-6 rounded-t-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <CreditCard className='text-primary' />
                        <h2 className="font-medium text-lg">Phương thức thanh toán</h2>
                    </div>
                    <p className="text-gray-500 text-sm">Chọn phương thức thanh toán phù hợp với bạn</p>
                </div>

                <div className="p-6">
                    <div>
                        <div className="grid grid-cols-3 mb-6">
                            <div
                                className="data-[state=active]:bg-[#f0a06a] data-[state=active]:text-white"
                            >
                                Phương thức
                            </div>
                            <div>Thông tin</div>
                            <div>Xác nhận</div>
                        </div>

                        <div>
                            <div className="bg-[#fffaf5] border border-[#f0a06a]/20 rounded-lg p-4 mb-6">
                                <div className="flex gap-2">
                                    <Info className="h-5 w-5 text-[#f0a06a]" />
                                    <p className="text-sm">
                                        <span className="font-medium">Chính sách đặt lịch:</span> Khi đặt dịch vụ studio, bạn cần đặt cọc
                                        trước một phần để xác nhận lịch hẹn. Số tiền còn lại sẽ được thanh toán vào ngày thực hiện dịch vụ.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-medium mb-4">Chọn mức đặt cọc</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <div className="absolute -top-2 right-4 bg-[#f0a06a] text-white text-xs px-2 py-0.5 rounded-full">
                                            Đã chọn
                                        </div>
                                        <div className="border-2 border-[#f0a06a] rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-[#f0a06a]">30%</div>
                                            <div className="text-sm text-gray-500">Đặt cọc</div>
                                        </div>
                                    </div>
                                    <div className="border rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-500">50%</div>
                                        <div className="text-sm text-gray-500">Đặt cọc</div>
                                    </div>
                                    <div className="border rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-500">70%</div>
                                        <div className="text-sm text-gray-500">Đặt cọc</div>
                                    </div>
                                    <div className="border rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-500">100%</div>
                                        <div className="text-sm text-gray-500">Thanh toán đủ</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-medium mb-4">Chọn phương thức thanh toán</h3>
                                <div defaultValue="card">
                                    <div className="border rounded-lg p-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div id="card" />
                                            <label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                                                <CreditCard className="h-5 w-5 text-[#f0a06a]" />
                                                <div>
                                                    <div className="font-medium">Thẻ tín dụng / Ghi nợ</div>
                                                    <div className="text-sm text-gray-500">Visa, Mastercard, JCB</div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="flex gap-2 mt-3 justify-end">
                                            <div className="h-8 w-12 bg-gray-100 rounded"></div>
                                            <div className="h-8 w-12 bg-gray-100 rounded"></div>
                                            <div className="h-8 w-12 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div id="momo" />
                                            <label htmlFor="momo" className="flex items-center gap-2 cursor-pointer">
                                                <div className="h-5 w-5 bg-pink-500 rounded-sm"></div>
                                                <div>
                                                    <div className="font-medium">Ví điện tử MoMo</div>
                                                    <div className="text-sm text-gray-500">Thanh toán qua ví MoMo</div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="flex justify-end mt-3">
                                            <div className="h-8 w-12 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div id="bank" />
                                            <label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                                                <div className="h-5 w-5 bg-blue-500 rounded-sm"></div>
                                                <div>
                                                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                                                    <div className="text-sm text-gray-500">
                                                        Chuyển khoản trực tiếp đến tài khoản của chúng tôi
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#fff9f2] rounded-lg p-5 border border-[#f0a06a]/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-[#f0a06a]" />
                                        <h3 className="font-medium">Thông tin thẻ</h3>
                                    </div>
                                    <div className="text-xs text-[#f0a06a] flex items-center gap-1">
                                        <Shield className="h-4 w-4" />
                                        Bảo mật
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Số thẻ</label>
                                        <Input placeholder="1234 5678 9012 3456" className="bg-white" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500 mb-1 block">Ngày hết hạn</label>
                                            <Input placeholder="MM/YY" className="bg-white" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500 mb-1 block">CVV</label>
                                            <Input placeholder="123" className="bg-white" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Tên chủ thẻ</label>
                                        <Input placeholder="NGUYỄN VĂN A" className="bg-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-8">
                        <Button variant="outline">Quay lại</Button>
                        <Button className="bg-[#f0a06a] hover:bg-[#e8935d]">
                            Tiếp tục
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutPage
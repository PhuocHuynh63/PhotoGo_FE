'use client'

import Button from '@components/Atoms/Button'
import Input from '@components/Atoms/Input'
import { Separator } from '@components/Atoms/Seperator/Seperator'
import { IBookingFormRequest } from '@models/booking/request.model'
import { IServiceConcept } from '@models/serviceConcepts/common.model'
import { IServicePackage } from '@models/servicePackages/common.model'
import { useFormBooking, useSelectedDeposit } from '@stores/checkout/selectors'
import { useServiceConcept, useServicePackage } from '@stores/vendor/selectors'
import { Calendar, Clock, Shield, Star } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

const SummaryInformation = () => {
    /**
     * Define variables from stores
     * - useServicePackage: Get the selected service package
     *  - useServiceConcept: Get the service concept details
     *  - useFormBooking: Get the booking form details
     *  - useSelectedDeposit: Get the selected deposit percentage
     */
    const servicePackage = useServicePackage() as IServicePackage
    const serviceConcept = useServiceConcept() as IServiceConcept
    const formBooking = useFormBooking() as IBookingFormRequest;
    const selectedDeposit = useSelectedDeposit();
    //----------------------End----------------------//

    /**
     * Calculate deposit and remaining amounts
     * - depositAmount: The amount to be deposited based on the selected percentage
     * - remainingAmount: The remaining amount after the deposit
     */
    const depositAmount = Number(serviceConcept.price) * (selectedDeposit) / 100;
    const remainingAmount = Number(serviceConcept.price) - depositAmount;
    //----------------------End----------------------//

    const [selectedVoucher, setSelectedVoucher] = useState<any>(null)

    return (
        <>
            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Star className="h-5 w-5 text-[#f0a06a]" />
                        <h2 className="font-medium text-lg">Tóm tắt đơn hàng</h2>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <Image
                            src={servicePackage?.image || '/placeholder.png'}
                            alt={servicePackage?.name || 'Service Package'}
                            className="h-16 w-16 bg-gray-100 rounded-md flex-shrink-0"
                            width={64}
                            height={64}
                        />
                        <div className="flex-1">
                            <h3 className="font-medium">{servicePackage?.name || 'NaN'}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <Star className="h-4 w-4 text-[#f0a06a] mr-1" />
                                {serviceConcept.name || 'NaN'}
                            </div>
                            <div className="flex gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formBooking.date || '30/04/1975'}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formBooking.time || '00:00'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <Separator className="my-6" /> */}

                    {/* <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="h-5 w-5 text-[#f0a06a]" />
                            <h3 className="font-medium">Dịch vụ bổ sung</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>Album ảnh cao cấp thêm</span>
                                <span className="font-medium">1,500,000đ</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Trang điểm cô dâu cao cấp</span>
                                <span className="font-medium">2,000,000đ</span>
                            </div>
                        </div>
                    </div> */}

                    <Separator className="my-6" />

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="h-5 w-5 text-[#f0a06a]" />
                            <h3 className="font-medium">Mã giảm giá</h3>
                        </div>

                        <div className="flex gap-2">
                            <Input placeholder="Nhập mã giảm giá" className="flex-1" />
                            <Button variant="outline" className="whitespace-nowrap">
                                Áp dụng
                            </Button>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tạm tính</span>
                            <span className="font-medium">{Number(serviceConcept.price).toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tổng cộng</span>
                            <span className="font-medium">{Number(serviceConcept.price).toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-[#f0a06a] font-medium">
                            <span>Đặt cọc ({selectedDeposit}%)</span>
                            <span>-{depositAmount.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Số tiền còn lại</span>
                            <span className="font-medium">{remainingAmount.toLocaleString()}đ</span>
                        </div>
                    </div>

                    <div className="bg-[#fffaf5] border border-[#f0a06a]/20 rounded-lg p-4 mb-6">
                        <div className="flex gap-2">
                            <Shield className="h-5 w-5 text-[#f0a06a] flex-shrink-0" />
                            <div className="text-sm">
                                <div className="font-medium mb-1">Thanh toán an toàn & bảo mật</div>
                                <p className="text-gray-500">
                                    Bạn có thể hủy đặt lịch miễn phí trước 48 giờ. Sau thời gian này, số tiền đặt cọc sẽ không được hoàn
                                    lại.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Star className="h-5 w-5 text-[#f0a06a]" />
                        <h2 className="font-medium text-lg">Chính sách đặt cọc</h2>
                    </div>

                    <ul className="space-y-3">
                        <li className="flex gap-2 text-sm">
                            <div className="h-5 w-5 rounded-full border border-green-500 flex items-center justify-center flex-shrink-0">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span>Đặt cọc tối thiểu 30% để xác nhận lịch hẹn</span>
                        </li>
                        <li className="flex gap-2 text-sm">
                            <div className="h-5 w-5 rounded-full border border-green-500 flex items-center justify-center flex-shrink-0">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span>Số tiền đặt cọc sẽ được trừ vào tổng giá trị dịch vụ</span>
                        </li>
                        <li className="flex gap-2 text-sm">
                            <div className="h-5 w-5 rounded-full border border-green-500 flex items-center justify-center flex-shrink-0">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span>Số tiền còn lại sẽ được thanh toán vào ngày thực hiện dịch vụ</span>
                        </li>
                        <li className="flex gap-2 text-sm">
                            <div className="h-5 w-5 rounded-full border border-green-500 flex items-center justify-center flex-shrink-0">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span>Đặt cọc 100% sẽ được ưu tiên lịch hẹn và được giảm 5% tổng hóa đơn</span>
                        </li>
                    </ul>

                    <div className="mt-6 text-center">
                        <div className="text-sm text-gray-500 mb-2">Cần hỗ trợ?</div>
                        <Button variant="link" className="text-white">
                            Liên hệ với chúng tôi
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SummaryInformation
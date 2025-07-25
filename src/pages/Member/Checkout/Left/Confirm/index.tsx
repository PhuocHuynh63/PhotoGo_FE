import { IServicePackage } from '@models/servicePackages/common.model';
import { useCheckoutSession, useFormBooking } from '@stores/checkout/selectors';
import { useServicePackage } from '@stores/vendor/selectors';
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import React from 'react'

const Confirm = () => {

    /**
     * Define variables zustand store
     */
    const formBooking = useFormBooking();
    const servicePackage = useServicePackage() as IServicePackage
    const checkoutSession = useCheckoutSession();
    //-----------------------------End-----------------------------//

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
                                <p className="font-medium">{servicePackage.name}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm mb-1">Nhà cung cấp</h3>
                                <p className="font-medium">{checkoutSession?.vendorDetails.name}</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className={`${formBooking.bookingType === 'một ngày' ? 'block' : 'flex'} items-center gap-2`}>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-[#f0a06a]" />
                                    {formBooking.bookingType === 'một ngày'
                                        ? <span>{formBooking.date}</span>
                                        : formBooking?.schedules?.length && formBooking.schedules.length > 0
                                            ? <span>{formBooking.schedules[0]}</span>
                                            : <span>NaN</span>
                                    }
                                </div>

                                {
                                    formBooking.bookingType === 'một ngày' ?
                                        <></> :
                                        <div className="w-3.5 h-0.5 bg-gray-500"></div>
                                }

                                <div className="flex items-center gap-2">
                                    {formBooking.bookingType === 'một ngày' ?
                                        <Clock className="h-5 w-5 text-[#f0a06a]" /> :
                                        <></>
                                    }

                                    {formBooking.bookingType === 'một ngày'
                                        ? <span>{formBooking.time}</span>
                                        : formBooking?.schedules?.length && formBooking.schedules.length > 0
                                            ? <span>{formBooking.schedules[formBooking.schedules.length - 1]}</span>
                                            : <span>NaN</span>
                                    }
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-5 w-5 text-[#f0a06a] mt-0.5" />
                                <span>{checkoutSession?.locationDetails.address}</span>
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
                                <p className="font-medium">{formBooking.fullName || NaN}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500 text-sm mb-1">Số điện thoại</h3>
                                <p className="font-medium">{formBooking.phone}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-gray-500 text-sm mb-1">Email</h3>
                            <p className="font-medium">{formBooking.email}</p>
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
'use client'

import { useVendor } from '@lib/vendorContext'
import { CalendarIcon, Clock, Globe, Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { ROUTES } from '@routes'
import { replaceParam } from '@utils/helpers/ReplaceParam'

const VendorContactInfomation = () => {

    const vendorData = useVendor() as any

    return (
        <>
            <div className="py-6 px-6.5 rounded-md bg-primary-opacity-2 ">
                <h3 className="font-bold text-lg mb-4">Thông tin liên hệ</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Địa chỉ</p>
                            <p className="text-sm text-muted-foreground">{vendorData?.location?.address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Điện thoại</p>
                            <p className="text-sm text-muted-foreground">{vendorData?.contact?.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{vendorData?.contact?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Website</p>
                            <p className="text-sm text-muted-foreground">{vendorData?.contact?.website}</p>
                        </div>
                    </div>
                </div>

                <h3 className="font-bold text-lg mb-3">Giờ làm việc</h3>
                <div className="space-y-2">
                    {vendorData?.businessHours?.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{item.day}</span>
                            </div>
                            <span className="text-sm font-medium">{item.hours}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <Link href={replaceParam(ROUTES.PUBLIC.VENDOR_DETAIL, 'page', 'booking')} className="w-full flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Đặt lịch ngay
                    </Link>
                </div>
            </div>
        </>
    )
}

export default VendorContactInfomation
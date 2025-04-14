'use client'

import { useVendor } from '@lib/vendorContext'
import { CalendarIcon, Clock, Globe, Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { ROUTES } from '@routes'
import { useParams, useRouter } from 'next/navigation'
import Button from '@components/Atoms/Button'

const VendorContactInformation = () => {

    const vendorData = useVendor() as any
    const params = useParams()
    const router = useRouter()
    const category = params?.category
    const service_type = params?.['service-type']
    const slug = params?.slug
    const href = `/${category}/${service_type}/${slug}`

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
                    <Button onClick={() => router.push(`${href}/booking`)} className="w-full flex justify-center items-center gap-2
                     rounded-md py-2 transition-all duration-200 ease-in-out">
                        <CalendarIcon className="h-4 w-4" />
                        Đặt lịch ngay
                    </Button>
                </div>
            </div>
        </>
    )
}

export default VendorContactInformation
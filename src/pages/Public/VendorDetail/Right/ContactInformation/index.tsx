'use client'

import { CalendarIcon, Clock, Globe, Mail, MapPin, Phone } from 'lucide-react'
import React, { useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Button from '@components/Atoms/Button'
import { ROUTES } from '@routes'
import { useVendor } from '@stores/vendor/selectors'
import { IVendor } from '@models/vendor/common.model'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Atoms/ui/select'
import { Badge } from '@components/Atoms/ui/badge'

const VendorContactInformation = () => {

    const vendorData = useVendor() as IVendor
    // console.log('vendorData', vendorData);

    /**
     * Define params and router for navigation
     */
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()

    const slug = params?.slug as string
    const location = searchParams?.get('location') as string
    //---------------------------End---------------------------//

    /**
     * State to manage selected branch
     */
    const selectedBranch = vendorData?.locations?.find(
        (branch) => branch.district === location
    )
    const selectedBranchId = selectedBranch?.id || ''

    const handleBranchChange = (branchId: string) => {
        const branch = vendorData?.locations?.find((b) => b.id === branchId)
        if (!branch) return

        const current = new URLSearchParams(searchParams?.toString())
        current.set('location', branch.district)
        const newUrl = `${ROUTES.PUBLIC.VENDOR_DETAIL.replace(':slug', slug).replace(':page', '')}?${current.toString()}`
        router.push(newUrl)
    }
    //---------------------------End---------------------------//

    console.log(vendorData?.locations);

    const addressVendor = vendorData?.locations?.length
        ? `${vendorData.locations[0]?.address}, ${vendorData.locations[0]?.ward}, ${vendorData.locations[0]?.district}, ${vendorData.locations[0]?.city}, ${vendorData.locations[0]?.province}`
        : ''


    return (
        <>
            <div className="py-6 px-6.5 mb-4.5 rounded-md bg-primary-opacity- border border-grey">
                <h3 className="font-bold text-lg mb-4">Chọn chi nhánh</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Chọn chi nhánh gần bạn nhất</p>
                        </div>
                    </div>

                    <Select
                        value={selectedBranchId}
                        onValueChange={handleBranchChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Chọn chi nhánh' />
                        </SelectTrigger>
                        <SelectContent>
                            {vendorData?.locations?.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id}>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{branch.district}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div >

            <div className="py-6 px-6.5 rounded-md bg-primary-opacity- border border-grey">
                <h3 className="font-bold text-lg mb-4">Thông tin liên hệ</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Địa chỉ</p>
                            <p className="text-sm text-muted-foreground">{addressVendor}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Điện thoại</p>
                            <p className="text-sm text-muted-foreground">{vendorData?.user_id?.phoneNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{vendorData?.user_id?.email}</p>
                        </div>
                    </div>
                </div>

                <h3 className="font-bold text-lg mb-3">Giờ làm việc</h3>
                <div className="space-y-2">
                    {/* {vendorData?.businessHours?.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{item.day}</span>
                            </div>
                            <span className="text-sm font-medium">{item.hours}</span>
                        </div>
                    ))} */}
                </div>

                <div className="mt-6">
                    <Button onClick={() => router.push(`${ROUTES.PUBLIC.VENDOR_DETAIL.replace(':slug', slug).replace(':page', 'packages')}`)} className="w-full flex justify-center items-center gap-2
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
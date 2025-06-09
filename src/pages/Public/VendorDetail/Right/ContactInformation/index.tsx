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
    const branch = searchParams?.get('branch') as string
    console.log('branch', branch);
    //---------------------------End---------------------------//

    /**
     * State to manage selected branch
     */
    const [selectedBranchId, setSelectedBranchId] = useState(vendorData.locations?.[0]?.id || '');
    const selectedBranch = vendorData.locations?.find(b => b.id === selectedBranchId);
    const handleBranchChange = (branchId: string) => {
        setSelectedBranchId(branchId);
        router.push(`${ROUTES.PUBLIC.VENDOR_DETAIL.replace(':slug', slug).replace(':page', '')}?branch=${selectedBranch}`);
    };
    //---------------------------End---------------------------//


    return (
        <>
            <div className="py-6 px-6.5 mb-4.5 rounded-md bg-primary-opacity- border border-grey">
                <h3 className="font-bold text-lg mb-4">Chọn chi nhánh</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Chọn chi nhánh gần bạn nhất</p>
                            <p className="text-sm text-muted-foreground">{vendorData?.location?.address}</p>
                        </div>
                    </div>

                    <Select
                        value={selectedBranchId}
                        onValueChange={(value) => {
                            const branch = vendorData?.locations?.find((b) => b.id === value)
                            if (branch) setSelectedBranchId(branch.id)
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {vendorData?.locations?.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id}>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{branch.district}</span>
                                        {/* {branch.isMain && (
                                            <Badge variant="secondary" className="text-xs">
                                                Chính
                                            </Badge>
                                        )} */}
                                        {/* {!branch.available && (
                                            <Badge variant="secondary" className="text-xs">
                                                Hết lịch
                                            </Badge>
                                        )} */}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="py-6 px-6.5 rounded-md bg-primary-opacity- border border-grey">
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
                    {/* <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Website</p>
                            <p className="text-sm text-muted-foreground">{vendorData?.contact?.website}</p>
                        </div>
                    </div> */}
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
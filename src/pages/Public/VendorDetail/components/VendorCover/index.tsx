'use client'

import Button from '@components/Atoms/Button'
import { Badge, Heart, MapPin, Share2, Star } from 'lucide-react'
import React from 'react'
import ButtonVendorDetail from '../ButtonVendorDetail'
import { useParams, useRouter } from 'next/navigation'
import { ROUTES } from '@routes'
import { useVendor } from '@stores/vendor/selectors'
import { IVendor } from '@models/vendor/common.model'
import { Skeleton } from '@components/Atoms/ui/skeleton'

const VendorCover = () => {

    /**
     * Call vendor store to get vendor data
     */
    const vendorData = useVendor() as IVendor
    //-----------------------------End---------------------------------//

    const router = useRouter()
    const params = useParams()
    const slug = params?.slug as string


    return (
        <section className="relative">
            <div className="h-[300px] md:h-[400px] w-full relative">
                {vendorData?.banner ?
                    <img
                        src={vendorData?.banner}
                        alt={vendorData?.name}
                        className="max-h-full w-full object-cover rounded-lg shadow-md"
                    />
                    : (
                        <Skeleton className='h-full w-full rounded bg-grey' />
                    )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
            </div>

            <div className="mx-10 my-14 -mt-24 md:m-14 md:-mt-24 bg-light rounded-lg relative z-10">
                <div className="bg-background rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex justify-center w-full sm:w-fit -mt-12 md:mt-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-4 border-background shadow-md">
                            {vendorData?.logo ?
                                <img
                                    src={vendorData?.logo}
                                    alt={`${vendorData?.name} logo`}
                                    className="w-full h-full object-cover"
                                />
                                : (
                                    <Skeleton className='h-full w-full rounded bg-grey' />
                                )}
                        </div>
                    </div>

                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                {vendorData?.name ?
                                    <h1 className="text-2xl md:text-3xl font-bold">{vendorData?.name}</h1>
                                    : (
                                        <Skeleton className='h-8 w-50 rounded bg-grey' />
                                    )}
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                        <span className="ml-1 font-medium">{vendorData?.averageRating}</span>
                                        <span className="text-muted-foreground ml-1">({/*{vendorData?.reviewCount}*/}0 đánh giá)</span>
                                    </div>
                                    <span className="text-muted-foreground">•</span>
                                    <div className="flex items-center text-muted-foreground">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {/* <span className="text-sm truncate max-w-[240px]">{vendorData?.location.address}</span> */}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {/* {vendorData?.tags?.slice(0, 5).map((tag: any, index: number) => (
                                        <Badge key={index} className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {vendorData?.tags.length > 5 && (
                                        <Badge className="text-xs">
                                            +{vendorData?.tags.length - 5}
                                        </Badge>
                                    )} */}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <ButtonVendorDetail className="gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span className="hidden sm:inline">Lưu</span>
                                </ButtonVendorDetail>
                                <ButtonVendorDetail className="gap-1">
                                    <Share2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Chia sẻ</span>
                                </ButtonVendorDetail>
                                <Button onClick={() => router.push(`${ROUTES.PUBLIC.VENDOR_DETAIL.replace(':slug', slug).replace(':page', 'packages')}`)}>Đặt lịch ngay</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VendorCover
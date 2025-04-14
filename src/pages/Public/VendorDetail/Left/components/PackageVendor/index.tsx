import { ROUTES } from '@routes'
import React from 'react'
import ButtonNoBackgroundVendorDetail from '../ButtonNoBackGroundVendorDetail'
import { Badge, ChevronRight, Clock, Eye, Info } from 'lucide-react'
import Button from '@components/Atoms/Button'
import { Card } from '@components/Atoms/Card'
import { useVendor } from '@lib/vendorContext'
import { useRouter } from 'next/navigation'

const PackageVendor = () => {
    const router = useRouter()

    const vendorData = useVendor() as any
    return (
        <div className="space-y-6">
            {vendorData?.packages
                .filter((pkg: any) => pkg.popular)
                .map((pkg: any) => (
                    <Card key={pkg?.id} className="overflow-hidden border-grey">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3">
                                <img
                                    src={pkg?.image || "/placeholder.svg"}
                                    alt={pkg?.name}
                                    width={400}
                                    height={300}
                                    className="w-full h-60 object-cover"
                                />
                            </div>
                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{pkg?.name}</h3>
                                    <div className="bg-primary text-white px-4 py-0.5 text-sm rounded-4xl">Phổ biến</div>
                                </div>
                                <p className="text-muted-foreground mb-4">{pkg?.description}</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-lg font-bold text-primary">{pkg?.price}</div>
                                    {pkg?.duration && (
                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {pkg?.duration}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button className='py-2 h-11'>Đặt ngay</Button>
                                    <div>
                                        <div>
                                            <ButtonNoBackgroundVendorDetail variant="outline" className="flex items-center">
                                                <Eye className="h-4 w-4" />
                                                Xem concept
                                            </ButtonNoBackgroundVendorDetail>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div >
                    </Card >
                ))}
        </div >

    )
}

export default PackageVendor
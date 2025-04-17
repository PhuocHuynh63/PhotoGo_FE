'use client'

import React, { useState } from 'react'
import ButtonNoBackgroundVendorDetail from '../ButtonNoBackGroundVendorDetail'
import { Clock, Eye } from 'lucide-react'
import { Card } from '@components/Atoms/Card'
import { useVendor } from '@lib/vendorContext'
import ViewConcept from '@pages/Public/VendorDetail/components/ViewConcept'

type PackageVendorProps = {
    isOverview?: boolean
}

const PackageVendor = ({ isOverview = false }: PackageVendorProps) => {
    const vendorData = useVendor() as any
    const firstPackage = vendorData?.packages?.[0]


    //#region View Concept
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<any>(null)
    const handleViewConcept = (id: string) => {
        setSelectedPackage(id)
        setIsOpen(!isOpen)
    }
    //#endregion

    return isOverview ? (
        <>
            <div className="space-y-6">
                {firstPackage && (
                    <Card key={firstPackage.id} className="overflow-hidden border-grey">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3">
                                <img
                                    src={firstPackage.image || "/placeholder.svg"}
                                    alt={firstPackage.name}
                                    width={400}
                                    height={300}
                                    className="w-full h-60 object-cover"
                                />
                            </div>
                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{firstPackage.name}</h3>
                                    <div className="bg-primary text-white px-4 py-0.5 text-sm rounded-4xl">Phổ biến</div>
                                </div>
                                <p className="text-muted-foreground mb-4">{firstPackage.description}</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-lg font-bold text-primary">{firstPackage.price}</div>
                                    {firstPackage.duration && (
                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {firstPackage.duration}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <ButtonNoBackgroundVendorDetail variant="outline" className="flex items-center" onClick={() => handleViewConcept(firstPackage.id)}>
                                        <Eye className="h-4 w-4" />
                                        Xem concept
                                    </ButtonNoBackgroundVendorDetail>
                                </div>
                            </div >
                        </div >
                    </Card >
                )}
            </div >
        </>
    ) : (
        <>
            <div className="space-y-4">
                {vendorData?.packages
                    ?.filter((pkg: any) => pkg.popular)
                    .map((pkg: any) => (
                        <Card key={pkg.id} className="overflow-hidden border-grey">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3">
                                    <img
                                        src={pkg.image || "/placeholder.svg"}
                                        alt={pkg.name}
                                        width={400}
                                        height={300}
                                        className="w-full h-60 object-cover"
                                    />
                                </div>
                                <div className="flex-1 p-6">
                                    <h3 className="font-bold text-lg">{pkg.name}</h3>
                                    <p className="text-muted-foreground mb-4">{pkg.description}</p>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-lg font-bold text-primary">{pkg.price}</div>
                                        {pkg.duration && (
                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {pkg.duration}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <ButtonNoBackgroundVendorDetail variant="outline" className="flex items-center" onClick={() => handleViewConcept(pkg.id)}>
                                            <Eye className="h-4 w-4" />
                                            Xem concept
                                        </ButtonNoBackgroundVendorDetail>
                                    </div>
                                </div >
                            </div >
                        </Card >
                    ))}
            </div >

            <ViewConcept isOpen={isOpen} onOpenChange={() => handleViewConcept(selectedPackage)} />
        </>
    )
}

export default PackageVendor

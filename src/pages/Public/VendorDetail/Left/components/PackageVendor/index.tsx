'use client'

import React, { useState } from 'react'
import ButtonNoBackgroundVendorDetail from '../ButtonNoBackGroundVendorDetail'
import { Clock, Eye } from 'lucide-react'
import { Card } from '@components/Atoms/Card'

import ViewConcept from '@pages/Public/VendorDetail/components/ViewConcept'
import { IVendor } from '@models/vendor/common.model'
import { useVendor } from '@stores/vendor/selectors'
import { IServicePackage } from '@models/servicePackages/common.model'
import { Skeleton } from '@components/Atoms/ui/skeleton'

type PackageVendorProps = {
    isOverview?: boolean
}

const PackageVendor = ({ isOverview = false }: PackageVendorProps) => {
    const vendorData = useVendor() as IVendor

    const firstPackage = vendorData?.servicePackages?.[0]

    //#region View Concept
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<any>(null)
    const handleViewConcept = (id: string) => {
        setSelectedPackage(id)
        setIsOpen(!isOpen)
    }
    //#endregion

    //#region Render Image
    const renderImage = (imageUrl?: string, alt = '') => {
        return imageUrl ? (
            <img
                src={imageUrl}
                alt={alt}
                width={400}
                height={300}
                className="w-full h-60 object-cover"
            />
        ) : (
            <Skeleton className="w-full h-60 bg-grey" />
        )
    }
    //#endregion

    //#region Render Package Content
    const renderPackageContent = (pkg: IServicePackage) => (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
                {renderImage(pkg.image, pkg.name)}
            </div>
            <div className="flex-1 p-6 space-y-3">
                <div className="flex justify-between items-start">
                    {pkg.name ? (
                        <h3 className="font-bold text-xl">{pkg.name}</h3>
                    ) : (
                        <Skeleton className="h-6 w-40 rounded bg-grey" />
                    )}
                    {/* <div className="bg-primary text-white px-4 py-0.5 text-sm rounded-4xl">Phổ biến</div> */}
                </div>

                {pkg.description ? (
                    <p className="text-muted-foreground">{pkg.description}</p>
                ) : (
                    <Skeleton className="h-4 w-full round bg-greyed" />
                )}

                <div className="flex items-center gap-3">
                    {pkg.price ? (
                        <div className="text-lg font-bold text-primary">{pkg.price.toLocaleString()}</div>
                    ) : (
                        <Skeleton className="h-6 w-24 rounded bg-grey" />
                    )}

                    {pkg.duration ? (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {pkg.duration}
                        </div>
                    ) : (
                        <Skeleton className="h-6 w-20 rounded bg-grey" />
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <ButtonNoBackgroundVendorDetail
                        variant="outline"
                        className="flex items-center"
                        onClick={() => handleViewConcept(pkg.id)}
                    >
                        <Eye className="h-4 w-4" />
                        Xem concept
                    </ButtonNoBackgroundVendorDetail>
                </div>
            </div>
        </div>
    )
    //#endregion

    return isOverview ? (
        <div className="space-y-6">
            {firstPackage && (
                <Card key={firstPackage.id} className="overflow-hidden border-grey">
                    {renderPackageContent(firstPackage)}
                </Card>
            )}
        </div>
    ) : (
        <>
            <div className="space-y-4">
                {vendorData?.servicePackages?.map((pkg: IServicePackage) => (
                    <Card key={pkg.id} className="overflow-hidden border-grey">
                        {renderPackageContent(pkg)}
                    </Card>
                ))}
            </div>

            <ViewConcept
                isOpen={isOpen}
                onOpenChange={() => handleViewConcept(selectedPackage)}
            />
        </>
    )
}

export default PackageVendor
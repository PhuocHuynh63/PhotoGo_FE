'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ButtonNoBackgroundVendorDetail from '../ButtonNoBackGroundVendorDetail'
import { Eye } from 'lucide-react'
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
    /**
     * Call vendor store to get vendor data
     */
    const vendorData = useVendor() as IVendor
    const searchParams = useSearchParams()
    //-----------------------------End---------------------------------//

    //TODO: remove this when we have real data
    const firstPackage = vendorData?.servicePackages?.[0]

    //#region View Concept
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
    const servicePackage = vendorData?.servicePackages?.find((pkg) => pkg.id === selectedPackage) as IServicePackage

    const handleViewConcept = (id: string) => {
        setSelectedPackage(id)
        setIsOpen(!isOpen)
        // Reset initialConceptId when manually opening/closing modal
        if (isOpen) {
            setInitialConceptId(null)
        }
    }

    // Store conceptId from URL params
    const [initialConceptId, setInitialConceptId] = useState<string | null>(null)

    // Handle URL query params for auto-opening concept modal
    useEffect(() => {
        if (vendorData?.servicePackages && !isOverview) {
            const conceptId = searchParams?.get('conceptId')

            if (conceptId) {
                // Tìm package chứa concept với ID tương ứng
                const targetPackage = vendorData.servicePackages.find(pkg =>
                    pkg.serviceConcepts?.some(concept => concept.id === conceptId)
                )

                if (targetPackage) {
                    setSelectedPackage(targetPackage.id)
                    setInitialConceptId(conceptId)
                    setIsOpen(true)

                    // Optional: scroll to the package
                    setTimeout(() => {
                        const packageElement = document.getElementById(`package-${targetPackage.id}`)
                        if (packageElement) {
                            packageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                    }, 100)
                }
            }
        }
    }, [vendorData?.servicePackages, searchParams, isOverview])
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
        <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3 w-full">
                {renderImage(pkg.image, pkg.name)}
            </div>
            <div className="flex-1 px-4 py-3 md:p-6 space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-2">
                    {pkg.name ? (
                        <h3 className="font-bold text-lg md:text-xl">{pkg.name}</h3>
                    ) : (
                        <Skeleton className="h-6 w-40 rounded bg-grey" />
                    )}
                    {/* <div className="bg-primary text-white px-4 py-0.5 text-sm rounded-4xl">Phổ biến</div> */}
                </div>

                {pkg.description ? (
                    <p className="text-sm md:text-base text-muted-foreground">{pkg.description}</p>
                ) : (
                    <Skeleton className="h-4 w-full rounded bg-greyed" />
                )}

                {/* Duration + Price */}
                {/* <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                    {pkg.price ? (
                        <div className="font-bold text-primary">{pkg.price.toLocaleString()}</div>
                    ) : (
                        <Skeleton className="h-6 w-24 rounded bg-grey" />
                    )}

                    {pkg.duration ? (
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {pkg.duration}
                        </div>
                    ) : (
                        <Skeleton className="h-6 w-20 rounded bg-grey" />
                    )}
                </div> */}

                <div className="flex items-center gap-4">
                    <ButtonNoBackgroundVendorDetail
                        variant="outline"
                        className="flex items-center text-sm"
                        onClick={() => handleViewConcept(pkg.id)}
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        Xem concept
                    </ButtonNoBackgroundVendorDetail>
                </div>
            </div>
        </div>
    )
    //#endregion

    return isOverview ? (
        <>
            {firstPackage ? (
                <div className="space-y-6">
                    <Card key={firstPackage.id} className="overflow-hidden border-grey">
                        {renderPackageContent(firstPackage)}
                    </Card>
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    Đối tác này hiện chưa cập nhật gói dịch vụ
                </div>
            )}
            <ViewConcept
                isOpen={isOpen}
                onOpenChange={() => selectedPackage && handleViewConcept(selectedPackage)}
                servicePackage={servicePackage}
                initialConceptId={initialConceptId || undefined}
            />
        </>
    ) : (
        <>
            {vendorData?.servicePackages?.length ? (
                <div className="space-y-4">
                    {vendorData.servicePackages.map((pkg: IServicePackage) => (
                        <Card
                            key={pkg.id}
                            id={`package-${pkg.id}`}
                            className="overflow-hidden border-grey"
                        >
                            {renderPackageContent(pkg)}
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    Đối tác này hiện chưa cập nhật gói dịch vụ
                </div>
            )}
            <ViewConcept
                isOpen={isOpen}
                onOpenChange={() => selectedPackage && handleViewConcept(selectedPackage)}
                servicePackage={servicePackage}
                initialConceptId={initialConceptId || undefined}
            />
        </>
    )
}

export default PackageVendor
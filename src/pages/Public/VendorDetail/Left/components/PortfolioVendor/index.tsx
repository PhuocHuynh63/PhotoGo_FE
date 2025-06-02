'use client'

import { Skeleton } from '@components/Atoms/ui/skeleton'
import { IServiceConceptImageModel } from '@models/serviceConcepts/common.model'
import { useServiceConceptImages } from '@stores/vendor/selectors'
import React from 'react'

type PortfolioVendorProps = {
    isOverview?: boolean
}

const PortfolioVendor = ({ isOverview = true }: PortfolioVendorProps) => {
    const vendorData = useServiceConceptImages() as IServiceConceptImageModel[];
    console.log("PortfolioVendor Data:", vendorData);

    const loadingImg = (img: string) => {
        return (
            img ?
                (
                    <img
                        src={img}
                        alt="Portfolio Image"
                        className="w-full h-64 object-contain transition-transform group-hover:scale-105"
                    />
                ) : (
                    <Skeleton className="h-4 w-3/4" />
                )
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vendorData
                    .filter((item: IServiceConceptImageModel) => isOverview ? item?.service_concept_id : true)
                    .map((item: IServiceConceptImageModel) => (
                        <div key={item?.id} className="relative group overflow-hidden rounded-lg">
                            {/* Image */}
                            {loadingImg(item?.image_url)}

                            <div className="cursor-pointer absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                {/* <h3 className="text-white font-semibold">{item?.title}</h3> */}
                                {/* <p className="text-white/80 text-sm">{item?.service_concept_id}</p> */}
                            </div>
                        </div>
                    ))}
            </div>

            {vendorData.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                    {isOverview ? "No portfolio images available." : "No images found for this service concept."}
                </div>
            )}
        </>
    )
}

export default PortfolioVendor

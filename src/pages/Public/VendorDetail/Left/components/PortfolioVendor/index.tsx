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
            img ? img : (
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
        </>
    )
}

export default PortfolioVendor

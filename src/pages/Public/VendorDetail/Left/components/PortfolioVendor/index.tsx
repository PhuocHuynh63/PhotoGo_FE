'use client'

import { useVendor } from '@lib/vendorContext'
import React from 'react'

type PortfolioVendorProps = {
    isOverview?: boolean
}

const PortfolioVendor = ({ isOverview = true }: PortfolioVendorProps) => {
    const vendorData = useVendor() as any

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vendorData?.portfolio?.items
                    .filter((item: any) => item?.featured)
                    .slice(0, isOverview ? 3 : vendorData?.portfolio?.items.length)
                    .map((item: any) => (
                        <div key={item?.id} className="relative group overflow-hidden rounded-lg">
                            <img
                                src={item?.image || "/placeholder.svg"}
                                alt={item?.title}
                                width={400}
                                height={300}
                                className="w-full h-64 object-contain transition-transform group-hover:scale-105"
                            />
                            <div className="cursor-pointer absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <h3 className="text-white font-semibold">{item?.title}</h3>
                                <p className="text-white/80 text-sm">{item?.category}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}

export default PortfolioVendor

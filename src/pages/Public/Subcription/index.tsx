'use client'

import PricingPackage from '@components/Organisms/PricingPackages'
import React from 'react'
import HeaderPricing from './components/Header'
import SelectionPricing from './components/Selection'

const SubcriptionPage = () => {
    return (
        <div className="mx-auto px-4 py-16">
            <HeaderPricing />
            <SelectionPricing />
            <PricingPackage />
        </div>
    )
}

export default SubcriptionPage
'use client'

import PricingPackage from '@components/Organisms/PricingPackages'
import React from 'react'
import TitlePricing from './components/Title'
import SelectionPricing from './components/Selection'
import { useSelectMethod } from '@stores/pricing/selectors'
import { Camera } from 'lucide-react'

const SubcriptionPage = () => {
    const selectedMethod = useSelectMethod();
    const packageList = [
        {
            name: 'Studio Basic',
            description: 'Chụp ảnh cơ bản trong studio',
            price: '799.000₫',
            unit: '/tháng',
            icon: <Camera className="h-5 w-5 text-gray-700" />,
            features: [
                '2 giờ chụp trong studio',
                '20 ảnh đã chỉnh sửa',
                '2 phông nền tùy chọn',
                'Tư vấn trang phục',
            ],
        },
        {
            name: 'Studio Premium',
            description: 'Chụp ảnh cao cấp trong studio',
            price: '1.499.000₫',
            unit: '/tháng',
            icon: <Camera className="h-5 w-5 text-gray-700" />,
            features: [
                '3 giờ chụp trong studio',
                '50 ảnh đã chỉnh sửa',
                '4 phông nền tùy chọn',
                'Tư vấn trang phục',
                'Hỗ trợ trang điểm',
            ],
        },
        {
            name: 'Studio Deluxe',
            description: 'Chụp ảnh cao cấp trong studio',
            price: '2.499.000₫',
            unit: '/tháng',
            icon: <Camera className="h-5 w-5 text-gray-700" />,
            features: [
                '4 giờ chụp trong studio',
                '100 ảnh đã chỉnh sửa',
                '6 phông nền tùy chọn',
                'Tư vấn trang phục',
                'Hỗ trợ trang điểm',
                'Album ảnh in chất lượng cao',
            ],
        },
    ]

    const packageListSession = [
        {
            name: 'Studio Basic',
            description: 'Chụp ảnh cơ bản trong studio',
            price: '799.000₫',
            unit: '/buổi',
            icon: <Camera className="h-5 w-5 text-gray-700" />,
            features: [
                '2 giờ chụp trong studio',
                '20 ảnh đã chỉnh sửa',
                '2 phông nền tùy chọn',
                'Tư vấn trang phục',
            ],
        },
        {
            name: 'Studio Premium',
            description: 'Chụp ảnh cao cấp trong studio',
            price: '1.499.000₫',
            unit: '/buổi',
            icon: <Camera className="h-5 w-5 text-gray-700" />,
            features: [
                '3 giờ chụp trong studio',
                '50 ảnh đã chỉnh sửa',
                '4 phông nền tùy chọn',
                'Tư vấn trang phục',
                'Hỗ trợ trang điểm',
            ],
        },
        {
            name: 'Studio Deluxe',
            description: 'Chụp ảnh cao cấp trong studio',
            price: '2.499.000₫',
            unit: '/buổi',
            icon: <Camera className="h-5 w-5 text-gray-700" />,
            features: [
                '4 giờ chụp trong studio',
                '100 ảnh đã chỉnh sửa',
                '6 phông nền tùy chọn',
                'Tư vấn trang phục',
                'Hỗ trợ trang điểm',
                'Album ảnh in chất lượng cao',
            ],
        },
    ]
    return (
        <div className="mx-auto px-4 py-16">
            {/* Title */}
            <TitlePricing />
            {/* Select Method */}
            <SelectionPricing />

            {/* Pricing Package */}
            {selectedMethod === 'month' ? (
                <PricingPackage subscriptions={packageList} />
            ) :
                <PricingPackage subscriptions={packageListSession} />
            }

        </div>
    )
}

export default SubcriptionPage
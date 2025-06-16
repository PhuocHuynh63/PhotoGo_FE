'use client'

import { ROUTES } from '@routes'
import NavLink from '@utils/helpers/NavLink'
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

const VendorNavigation = () => {
    /**
     *  Get slug from URL and search parameters
     *  Use useParams to get the slug and useSearchParams to get the location
     */
    const params = useParams()
    const slug = params?.slug as string
    const searchParams = useSearchParams();
    const location = searchParams?.get('location');
    //-----------------------------End---------------------------------//

    const tabs = [
        { label: 'Tổng quan', page: '' },
        { label: 'Gói dịch vụ', page: 'packages' },
        { label: 'Tác phẩm', page: 'portfolio' },
        { label: 'Đánh giá', page: 'reviews' },
        { label: 'FAQ', page: 'faq' },
    ]

    return (
        <section className="border-b border-grey bg-background z-30 pb-1 -mt-8">
            <div className="mx-14 pb-2">
                <div className="flex gap-4 overflow-x-auto">
                    {tabs.map(tab => {
                        let tabHref = ROUTES.PUBLIC.VENDOR_DETAIL
                            .replace(':slug', slug)
                            .replace(':page', tab.page)
                        if (location) {
                            tabHref += `?location=${encodeURIComponent(location)}`;
                        }

                        return (
                            <NavLink
                                key={tab.page}
                                href={tabHref}
                                className="py-2.5 px-3.5 rounded-sm border-b-2 border-transparent data-[state=active]:border-primary hover:bg-gray-100"
                            >
                                {tab.label}
                            </NavLink>
                        )
                    })}
                </div>
            </div>
        </section>
    )

}

export default VendorNavigation
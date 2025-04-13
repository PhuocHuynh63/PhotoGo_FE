'use client'

import { ROUTES } from '@routes'
import NavLink from '@utils/helpers/NavLink'
import React from 'react'

const VendorNavigation = () => {
    return (
        <section className="border-b border-grey bg-background z-30 pb-1 -mt-8">
            <div className="mx-14 pb-2">
                <div className="flex gap-4 overflow-x-auto">
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":service-type", "photography").replace(":slug", "tony-wedding").replace(":page", "")}
                        className="py-2.5 px-3.5 rounded-sm border-b-2 border-transparent data-[state=active]:border-primary hover:bg-gray-100"
                    >
                        Tổng quan
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":service-type", "photography").replace(":slug", "tony-wedding").replace(":page", "packages")}
                        className="py-2.5 px-3.5 rounded-sm border-b-2 border-transparent data-[state=active]:border-primary hover:bg-gray-100"
                    >
                        Gói dịch vụ
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":service-type", "photography").replace(":slug", "tony-wedding").replace(":page", "portfolio")}
                        className="py-2.5 px-3.5 rounded-sm border-b-2 border-transparent data-[state=active]:border-primary hover:bg-gray-100"
                    >
                        Tác phẩm
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":service-type", "photography").replace(":slug", "tony-wedding").replace(":page", "team")}
                        className="py-2.5 px-3.5 rounded-sm border-b-2 border-transparent data-[state=active]:border-primary hover:bg-gray-100"
                    >
                        Đội ngũ
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":service-type", "photography").replace(":slug", "tony-wedding").replace(":page", "reviews")}
                        className="py-2.5 px-3.5 rounded-sm border-b-2 border-transparent data-[state=active]:border-primary hover:bg-gray-100"
                    >
                        Đánh giá
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":service-type", "photography").replace(":slug", "tony-wedding").replace(":page", "faq")}
                        className="py-2.5 px-3.5 rounded-sm border-b-2 border-transparent data-[state=active]:border-primary hover:bg-gray-100"
                    >
                        FAQ
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":service-type", "photography").replace(":slug", "tony-wedding").replace(":page", "booking")}
                        className="py-2.5 px-3.5 rounded-sm border-b-2 border-transparent data-[state=active]:border-primary hover:bg-gray-100"
                    >
                        Đặt lịch
                    </NavLink>
                </div>
            </div>
        </section>
    )
}

export default VendorNavigation
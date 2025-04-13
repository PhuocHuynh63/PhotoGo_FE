'use client'

import { ROUTES } from '@routes'
import NavLink from '@utils/helpers/NavLink'
import React from 'react'

const StudioNavigation = () => {
    return (
        <section className="border-b sticky top-16 bg-background z-30">
            <div className="container py-2">
                <div className="flex overflow-x-auto">
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":serviceType", "photography").replace(":slug", "tony-wedding").replace(":page", " ")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                        Tổng quan
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":serviceType", "photography").replace(":slug", "tony-wedding").replace(":page", "packages")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                        Gói dịch vụ
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":serviceType", "photography").replace(":slug", "tony-wedding").replace(":page", "portfolio")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                        Tác phẩm
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":serviceType", "photography").replace(":slug", "tony-wedding").replace(":page", "team")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                        Đội ngũ
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":serviceType", "photography").replace(":slug", "tony-wedding").replace(":page", "reviews")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                        Đánh giá
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":serviceType", "photography").replace(":slug", "tony-wedding").replace(":page", "faq")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                        FAQ
                    </NavLink>
                    <NavLink
                        href={ROUTES.PUBLIC.VENDOR_DETAIL.replace(":category", "studio").replace(":serviceType", "photography").replace(":slug", "tony-wedding").replace(":page", "booking")}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                        Đặt lịch
                    </NavLink>
                </div>
            </div>
        </section>
    )
}

export default StudioNavigation
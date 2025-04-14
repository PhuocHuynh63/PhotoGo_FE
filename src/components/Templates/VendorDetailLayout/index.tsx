'use client'

import VendorCover from '@pages/Public/VendorDetail/components/VendorCover'
import VendorNavigation from '@pages/Public/VendorDetail/components/VendorNavigation'
import React from 'react'
import { motion } from "framer-motion";
import VendorContactInformation from '@pages/Public/VendorDetail/Right/ContactInformation';

const VendorDetailLayoutPage = ({ children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex min-h-screen flex-col">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <VendorCover />
                <VendorNavigation />
            </motion.div>
            {/* Main content */}
            <div className="mx-14 py-8">
                <div className="grid grid-cols-12 gap-12">
                    {/* Left Content */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                        className="col-span-12 lg:col-span-8"
                    >
                        {children}
                    </motion.div>

                    {/* Right Content */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                        className="hidden lg:block lg:col-span-4 space-y-6 w-sm ml-4"
                    >
                        <VendorContactInformation />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default VendorDetailLayoutPage
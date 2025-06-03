'use client'

import VendorCover from '@pages/Public/VendorDetail/components/VendorCover'
import VendorNavigation from '@pages/Public/VendorDetail/components/VendorNavigation'
import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import VendorContactInformation from '@pages/Public/VendorDetail/Right/ContactInformation';
import GoogleMapVendor from '@pages/Public/VendorDetail/Right/GoogleMapVendor';
import SimilarVendor from '@pages/Public/VendorDetail/Right/SimilarVendors';
import { PAGES } from '../../../types/IPages';
import { useSetServiceConceptImages, useSetVendor } from '@stores/vendor/selectors';
import { useSetSession } from '@stores/user/selectors';

const VendorDetailLayoutPage = ({
    children,
    vendor,
    session,
    concept
}: PAGES.IVendorDetailPageProps) => {

    /**
     * * Set the vendor in the global state
     * @param vendor
     * @returns {void}
     */
    const setVendor = useSetVendor();
    const setSession = useSetSession();
    const setConceptImages = useSetServiceConceptImages();

    const reset = () => {
        setVendor(null);
        setSession(null);
        setConceptImages([]);
    }

    useEffect(() => {
        setVendor(vendor);
        setSession(session);
        setConceptImages(concept.data?.data || []);

        return () => {
            reset();
        }
    }, [vendor, session, concept, setVendor, setSession, setConceptImages]);
    //---------------------------End---------------------------//

    return (
        <>
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <VendorCover />
                <VendorNavigation />
            </motion.div>
            {/* Main content */}
            <div className="px-4 md:px-8 lg:mx-14 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Content */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                        className="col-span-1 lg:col-span-8"
                    >
                        {children}
                    </motion.div>

                    {/* Right Content */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                        className="col-span-1 lg:col-span-4 hidden lg:block"
                    >
                        <VendorContactInformation />
                        <GoogleMapVendor />
                        <SimilarVendor />
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default VendorDetailLayoutPage
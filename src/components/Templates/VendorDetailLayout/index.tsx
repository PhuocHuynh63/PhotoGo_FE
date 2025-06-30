'use client'

import VendorCover from '@pages/Public/VendorDetail/components/VendorCover'
import VendorNavigation from '@pages/Public/VendorDetail/components/VendorNavigation'
import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import VendorContactInformation from '@pages/Public/VendorDetail/Right/ContactInformation';
import GoogleMapVendor from '@pages/Public/VendorDetail/Right/GoogleMapVendor';
import SimilarVendor from '@pages/Public/VendorDetail/Right/SimilarVendors';
import { PAGES } from '../../../types/IPages';
import { useSetAddressLocation, useSetReviews, useSetServiceConceptImages, useSetVendor } from '@stores/vendor/selectors';
import { useSetSession } from '@stores/user/selectors';
import { useSearchParams } from 'next/navigation';
import Chatbot from '@components/Molecules/Chatbot';

const VendorDetailLayoutPage = ({
    children,
    vendor,
    session,
    concept,
    review,
}: PAGES.IVendorDetailPageProps) => {

    /**
     * State to manage selected branch
     */
    const searchParams = useSearchParams()
    const location = searchParams?.get('location') as string
    const setAddressLocation = useSetAddressLocation();

    useEffect(() => {
        if (vendor?.locations && location) {
            const filterLocation = vendor.locations.find(locationFilter =>
                location === locationFilter.district
            )

            if (filterLocation) {
                const address = `${filterLocation.address}, ${filterLocation.ward}, ${filterLocation.district}, ${filterLocation.city}, ${filterLocation.province}`
                setAddressLocation({
                    id: filterLocation.id,
                    address: address
                });
            }
        }
    }, [location, vendor])
    //---------------------------End---------------------------//

    /**
     * * Set the vendor in the global state
     * @param vendor
     * @returns {void}
     */
    const setVendor = useSetVendor();
    const setSession = useSetSession();
    const setConceptImages = useSetServiceConceptImages();
    const setReviews = useSetReviews();
    const reset = () => {
        setVendor(null);
        setSession(null);
        setConceptImages([]);
        setAddressLocation({ id: '', address: '' });
    }

    useEffect(() => {
        setVendor(vendor);
        setSession(session);
        setConceptImages(concept.data?.data || []);
        setReviews(review);
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

            <Chatbot />
        </>
    )
}

export default VendorDetailLayoutPage
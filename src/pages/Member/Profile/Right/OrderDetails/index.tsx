"use client"

import { useState, useEffect } from "react"
import { IBookingDetail } from "@models/booking/common.model";
import HeroSection from "@/pages/Member/Profile/Right/OrderDetails/components/HeroSection"
import CountdownCard from "@/pages/Member/Profile/Right/OrderDetails/components/CountdownCard"
import QRCard from "@/pages/Member/Profile/Right/OrderDetails/components/QRCard"
import TimelineCard from "@/pages/Member/Profile/Right/OrderDetails/components/TimelineCard"
import PaymentCard from "@/pages/Member/Profile/Right/OrderDetails/components/PaymentCard"
import CustomerCard from "@/pages/Member/Profile/Right/OrderDetails/components/CustomerCard"
import ServiceCard from "./components/ServiceCard"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import AblumAfterShoot from "./components/AlbumAfterShoot";
import { useVendorAlbumsByBookingId } from "@utils/hooks/useVendorAlbums";
import { useAddressLocation, useSetAddressLocation } from "@stores/vendor/selectors";
import { albumComponent } from "@constants/vendorAlbums";
import { BOOKING } from "@constants/booking";
import { IInvoiceModel } from "@models/invoice/common.model";

interface OrderDetailsProps {
    booking?: IBookingDetail;
}

export default function OrderDetails({ booking }: OrderDetailsProps) {
    const [day, month, year] = booking?.date?.split("/") || [];
    const formattedDate = `${year}-${month}-${day}`

    // Handle different booking types - multi-day vs single day
    const isMultiDay = booking?.serviceConcept?.conceptRangeType === "nhiều ngày"
    const targetDate = isMultiDay
        ? new Date(`${formattedDate}T00:00:00`).getTime() // For multi-day, use start of day
        : booking?.time
            ? new Date(`${formattedDate}T${booking?.time}`).getTime() // For single day with time
            : new Date(`${formattedDate}T00:00:00`).getTime() // Fallback to start of day

    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
    const [showFullDescription, setShowFullDescription] = useState(false)
    const router = useRouter()

    const invoice = booking?.invoices[0] as any;

    const firstName = booking?.fullName?.split(" ").pop() || booking?.fullName

    const handleBack = () => {
        router.back()
    }

    useEffect(() => {
        // Only set up countdown if we have a valid target date
        if (!targetDate) return

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate - now

            if (distance < 0) {
                clearInterval(interval)
                return
            }

        }, 1000)

        return () => clearInterval(interval)
    }, [targetDate])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }))
                    }
                })
            },
            { threshold: 0.1 },
        )

        const elements = document.querySelectorAll("[data-animate]")
        elements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    /**
     * State for managing visibility of components
     */
    const TIMELINE_STATUS_ORDER = [
        BOOKING.BOOKING_STATUS.PENDING,
        BOOKING.BOOKING_STATUS.CONFIRMED,
        BOOKING.BOOKING_STATUS.IN_PROGRESS,
        BOOKING.BOOKING_STATUS.COMPLETED
    ];
    const allPossibleStatuses = [BOOKING.BOOKING_STATUS.PENDING, BOOKING.BOOKING_STATUS.CONFIRMED, BOOKING.BOOKING_STATUS.CANCELLED, BOOKING.BOOKING_STATUS.IN_PROGRESS, BOOKING.BOOKING_STATUS.COMPLETED]
    const currentActualStatus = booking?.status?.toLowerCase();
    const currentStatusIndex = TIMELINE_STATUS_ORDER.findIndex(s => s === currentActualStatus);
    const completedStatuses = (currentStatusIndex > -1)
        ? TIMELINE_STATUS_ORDER.slice(0, currentStatusIndex)
        : [];
    //-------------------------End-------------------------//

    const qrURL = 'https://photogo.id.vn/booking/' + booking?.code

    /**
     * Fetch vendor albums by booking ID using custom hook
     * This will retrieve albums related to the booking, including photos and behind-the-scenes content.
     */
    const { vendorAlbums, loading, fetchVendorAlbumsByBookingId } = useVendorAlbumsByBookingId({
        bookingId: booking?.id || "",
    })

    useEffect(() => {
        if (booking?.id) {
            fetchVendorAlbumsByBookingId()
        }
    }, [booking?.id, fetchVendorAlbumsByBookingId])
    //-------------------------End--------------------//

    /**
     * Set the address location based on the selected location in the booking form
     * This will update the address location in the global state
     */
    const setAddressLocation = useSetAddressLocation();
    const addressLocation = useAddressLocation();
    useEffect(() => {
        if (booking?.locationId && booking?.location) {
            const address = `${booking?.location?.address}, ${booking?.location?.ward}, ${booking?.location?.district}, ${booking?.location?.city}, ${booking?.location?.province}`
            setAddressLocation({
                id: booking?.locationId,
                address: address
            });
        }
    }, [booking?.location, booking?.locationId, setAddressLocation])
    //---------------------------End---------------------------//

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-5xl mx-auto p-4 md:p-8 bg-[#fdfdfd] text-[#1a202c]"
        >
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                onClick={handleBack}
                className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6 group"
            >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Quay lại</span>
            </motion.button>

            <HeroSection
                isVisible={isVisible["hero-section"]}
                image={booking?.serviceConcept?.servicePackage?.image || ""}
                firstName={firstName || ""}
                addressLocation={addressLocation?.address || ""}
                studioName={booking?.location?.vendor?.name}
            />
            <main className="mt-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {booking?.date && booking?.date < new Date().toLocaleDateString() &&
                        <CountdownCard
                            isVisible={isVisible["countdown-card"]}
                            targetDate={targetDate}
                            isMultiDay={isMultiDay}
                            bookingDate={booking?.date}
                            bookingTime={booking?.time}
                            status={booking?.status}
                        />
                    }
                    <QRCard
                        isVisible={isVisible["qr-card"]}
                        code={booking?.code || ''}
                        qrURL={qrURL}
                        status={booking?.status}
                    />
                </div>
                <TimelineCard
                    isVisible={isVisible["timeline-card"]}
                    allPossibleStatuses={allPossibleStatuses}
                    status={booking?.status}
                    completedStatuses={completedStatuses}
                    currentStatusIndex={currentStatusIndex}
                />

                {booking?.status === BOOKING.BOOKING_STATUS.COMPLETED &&
                    <AblumAfterShoot
                        id={albumComponent.ALBUM_AFTER_SHOOT}
                        title="Album ảnh của bạn"
                        subTitle={`Cảm ơn bạn đã tin tưởng ${booking?.location?.vendor?.name}. Hy vọng bạn hài lòng với những khoảnh khắc tuyệt vời này!`}
                        isLoading={loading}
                        vendorAlbums={vendorAlbums}
                    />
                }

                {booking?.status === BOOKING.BOOKING_STATUS.IN_PROGRESS &&
                    <AblumAfterShoot
                        id={albumComponent.ALBUM_AFTER_SHOOT_BTS}
                        title="Khoảnh khắc hậu trường"
                        subTitle="Cùng nhìn lại những khoảnh khắc hậu trường thú vị nhé."
                        isLoading={loading}
                        vendorAlbums={vendorAlbums}
                    />
                }

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <PaymentCard
                        isVisible={isVisible["payment-card"]}
                        invoice={invoice}
                    />
                    <div className="lg:col-span-2 space-y-8">
                        {booking?.user && (
                            <CustomerCard
                                isVisible={isVisible["customer-card"]}
                                user={booking?.user}
                                fullName={booking?.fullName || ''}
                                email={booking?.email || ''}
                            />
                        )}
                        <ServiceCard
                            isVisible={isVisible["service-card"]}
                            description={booking?.serviceConcept?.description || ''}
                            showFullDescription={showFullDescription}
                            setShowFullDescription={setShowFullDescription}
                        />
                    </div>
                </div>
            </main>
        </motion.div>
    )
}

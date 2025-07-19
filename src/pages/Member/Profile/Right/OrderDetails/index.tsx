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


const mockOrderData: IBookingDetail = {
    id: "279ccf45-47b0-4a36-b8ab-caee6aa950b2",
    userId: "dd6659a5-58c4-4387-b006-bd018c7264f5",
    locationId: "9a179d53-8907-49e9-b3b4-161bb41603c3",
    serviceConceptId: "820f96de-59cb-42ab-9828-4d6bdbf52783",
    date: "26/06/2025",
    time: "08:00:00",
    status: "đã xác nhận",
    sourceType: "trực tiếp",
    sourceId: null,
    depositAmount: "100.00",
    depositType: "phần trăm",
    userNote: "f",
    fullName: "vu7 phi",
    phone: "0902757560",
    email: "vunguyennn007@gmail.com",
    code: "OQUN5K",
    created_at: "25/06/2025",
    updated_at: "25/06/2025",
    user: {
        id: "dd6659a5-58c4-4387-b006-bd018c7264f5",
        email: "vunguyennn007@gmail.com",
        passwordHash: "",
        oldPasswordHash: null,
        fullName: "vu7 phi",
        phoneNumber: "",
        avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocKf3hXNXcrWBWN64TkR8njuR3YNzuLkh_gFVur77jg5dOKpqw=s96-c",
        status: "hoạt động",
        rank: "Đồng",
        multiplier: "1.00",
        note: null,
        auth: "google",
        lastLoginAt: null,
        createdAt: "2025-06-22T16:54:30.470Z",
        updatedAt: "2025-06-22T16:54:30.470Z",
    },
    serviceConcept: {
        id: "820f96de-59cb-42ab-9828-4d6bdbf52783",
        servicePackageId: "a2068e30-e4da-40a7-a15f-bdaf6206fafb",
        name: "Gia đình truyền hình",
        description:
            "Thông tin chi tiết về gói chụp:  Make Up & Làm Tóc: Bao gồm 2 layout make up và làm tóc dành cho cả nam và nữ. Trang Phục & Concept: Cung cấp 1 bộ trang phục do Gạo Nâu chuẩn bị, cùng các phụ kiện đi kèm theo concept đã thống nhất. Background: Khách hàng được lựa chọn 1 background chụp ảnh. Ảnh Chỉnh Sửa Chuyên Nghiệp: Khách hàng sẽ nhận được 15 tấm ảnh đã qua chỉnh sửa hoàn thiện một cách kỹ lưỡng. Thời Gian Chụp Ảnh Linh Hoạt: Buổi chụp hình không bị giới hạn về thời gian. Dịch Vụ Chăm Sóc Đặc Biệt: Trước buổi chụp, cặp đôi sẽ được trải nghiệm dịch vụ đắp mặt nạ và massage chân thư giãn. Hỗ Trợ Tận Tình Từ Ekip: Đội ngũ chuyên nghiệp sẽ hỗ trợ tạo dáng và lựa chọn góc chụp đẹp nhất xuyên suốt buổi chụp. Không Gian & Bối Cảnh Đa Dạng: Buổi chụp không bị giới hạn về không gian và bối cảnh. Trả Toàn Bộ File Gốc: Khách hàng sẽ nhận được toàn bộ file ảnh gốc ngay trong ngày. Những lưu ý quan trọng từ Gạo Nâu:  Ưu đãi đặc biệt: Giảm ngay 28% khi khách hàng đặt thêm một concept chụp khác ngay trong ngày. Sản phẩm cuối cùng: Ngoài 15 ảnh đã được chỉnh sửa, khách hàng còn nhận được toàn bộ file ảnh gốc đã chụp. Xem trước và tư vấn: Khách hàng được kiểm tra hình ảnh và nhận tư vấn trực tiếp qua màn hình trong quá trình chụp. Chi phí trang phục thêm: Từ trang phục thứ hai trở đi sẽ tính thêm phụ phí phát sinh. Thời lượng buổi chụp: Một buổi chụp hoàn chỉnh, bao gồm cả thời gian make up và các dịch vụ chăm sóc trước buổi chụp, thường kéo dài khoảng 2 - 2.5 giờ. Thời gian giao ảnh chỉnh sửa: Khách hàng sẽ nhận được file ảnh chỉnh sửa hoàn thiện sau 3 - 4 ngày kể từ ngày chụp xong. Dịch vụ Takecare: Có gói chăm sóc kỹ lưỡng về tóc và trang phục xuyên suốt buổi chụp",
        price: "14000.00",
        duration: 0,
        conceptRangeType: "một ngày",
        numberOfDays: 1,
        status: "hoạt động",
        createdAt: "2025-05-26T18:36:04.492Z",
        updatedAt: "2025-06-24T01:41:25.473Z",
        servicePackage: {
            id: "a2068e30-e4da-40a7-a15f-bdaf6206fafb",
            vendorId: "6007174e-b54a-4358-96b4-c74d8740c362",
            name: "Chụp ảnh couple Nam - Nữ",
            description:
                'Gạo Nâu Chụp Ảnh tiếp tục mang đến một lựa chọn hấp dẫn cho các cặp đôi với gói chụp ảnh "Couple Nam - Nữ" trị giá 5.0 triệu đồng, được thiết kế để lưu giữ những khoảnh khắc ngọt ngào và đáng nhớ.',
            image:
                "https://res.cloudinary.com/dodtzdovx/image/upload/v1748281899/service-packages/images/olzjbkkouco4abavwp0u.jpg",
            status: "hoạt động",
            created_at: "2025-05-26T17:51:40.210Z",
            updated_at: "2025-05-26T17:51:40.210Z",
        },
    },
    histories: [
        {
            id: "08833955-bcaa-4654-b98c-2f6966d4634e",
            bookingId: "279ccf45-47b0-4a36-b8ab-caee6aa950b2",
            status: "chờ xử lý",
            changedAt: "25/06/2025",
        },
        {
            id: "39b78770-abde-4af5-940b-1879c09ee6ce",
            bookingId: "279ccf45-47b0-4a36-b8ab-caee6aa950b2",
            status: "đã xác nhận",
            changedAt: "25/06/2025",
        },
    ],
    invoices: [
        {
            id: "6adb48ea-d347-460c-b2a2-8cf52123a1ac",
            bookingId: "279ccf45-47b0-4a36-b8ab-caee6aa950b2",
            originalPrice: 14000,
            discountAmount: 0,
            discountedPrice: 14000,
            taxAmount: 1100,
            feeAmount: 0,
            payablePrice: 14000,
            depositAmount: 14000,
            remainingAmount: 0,
            paidAmount: 14000,
            status: "đã thanh toán một phần",
            issuedAt: "2025-06-25T04:11:07.031Z",
            updatedAt: "2025-06-25T04:12:38.242Z",
        },
    ],
    disputes: [],
    payablePrice: 14000,
}

interface OrderDetailsProps {
    booking?: IBookingDetail
}

export default function OrderDetails({ booking }: OrderDetailsProps) {
    // Use provided data or fallback to mock data
    const data = booking || mockOrderData
    const [day, month, year] = data.date.split("/")
    const formattedDate = `${year}-${month}-${day}`

    // Handle different booking types - multi-day vs single day
    const isMultiDay = data.serviceConcept?.conceptRangeType === "nhiều ngày"
    const targetDate = isMultiDay
        ? new Date(`${formattedDate}T00:00:00`).getTime() // For multi-day, use start of day
        : data.time
            ? new Date(`${formattedDate}T${data.time}`).getTime() // For single day with time
            : new Date(`${formattedDate}T00:00:00`).getTime() // Fallback to start of day

    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
    const [showFullDescription, setShowFullDescription] = useState(false)
    const router = useRouter()

    const invoice = data.invoices[0]
    const firstName = data.fullName.split(" ").pop() || data.fullName

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

    const allPossibleStatuses = ["chờ xử lý", "đã xác nhận", "đang thực hiện", "hoàn thành"]
    const completedStatuses = data.histories.map((h) => h.status.toLowerCase())
    const currentStatusIndex = completedStatuses.length - 1

    const qrURL = 'https://photogo.id.vn/booking/' + data.code

    /**
     * Fetch vendor albums by booking ID using custom hook
     * This will retrieve albums related to the booking, including photos and behind-the-scenes content.
     */
    const { vendorAlbums, loading, fetchVendorAlbumsByBookingId } = useVendorAlbumsByBookingId({
        bookingId: data.id,
    })

    useEffect(() => {
        if (data.id) {
            fetchVendorAlbumsByBookingId()
        }
    }, [data.id, fetchVendorAlbumsByBookingId])
    //-------------------------End--------------------//

    /**
     * Set the address location based on the selected location in the booking form
     * This will update the address location in the global state
     */
    const setAddressLocation = useSetAddressLocation();
    const addressLocation = useAddressLocation();
    useEffect(() => {
        if (booking?.locationId && booking?.location) {
            const address = `${booking?.location?.address}, ${booking?.location?.ward}, ${booking?.location.district}, ${booking?.location.city}, ${booking?.location.province}`
            setAddressLocation({
                id: booking?.locationId,
                address: address
            });
        }
    }, [location])
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
                image={data.serviceConcept.servicePackage.image}
                firstName={firstName}
                addressLocation={addressLocation?.address || ""}
                studioName={booking?.location?.vendor?.name}
            />
            <main className="mt-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <CountdownCard
                        isVisible={isVisible["countdown-card"]}
                        targetDate={targetDate}
                        isMultiDay={isMultiDay}
                        bookingDate={data.date}
                        bookingTime={data.time}
                    />
                    <QRCard
                        isVisible={isVisible["qr-card"]}
                        code={data.code}
                        qrURL={qrURL}
                    />
                </div>
                <TimelineCard
                    isVisible={isVisible["timeline-card"]}
                    allPossibleStatuses={allPossibleStatuses}
                    status={mockOrderData.status}
                    completedStatuses={completedStatuses}
                    currentStatusIndex={currentStatusIndex}
                />

                <AblumAfterShoot
                    id={albumComponent.ALBUM_AFTER_SHOOT}
                    title="Album ảnh của bạn"
                    subTitle={`Cảm ơn bạn đã tin tưởng ${booking?.location?.vendor?.name}. Hy vọng bạn hài lòng với những khoảnh khắc tuyệt vời này!`}
                    isLoading={loading}
                    vendorAlbums={vendorAlbums}
                />

                <AblumAfterShoot
                    id={albumComponent.ALBUM_AFTER_SHOOT_BTS}
                    title="Khoảnh khắc hậu trường"
                    subTitle="Cùng nhìn lại những khoảnh khắc hậu trường thú vị nhé."
                    isLoading={loading}
                    vendorAlbums={vendorAlbums}
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <PaymentCard
                        isVisible={isVisible["payment-card"]}
                        invoice={invoice}
                    />
                    <div className="lg:col-span-2 space-y-8">
                        <CustomerCard
                            isVisible={isVisible["customer-card"]}
                            user={data.user}
                            fullName={data.fullName}
                            email={data.email}
                        />
                        <ServiceCard
                            isVisible={isVisible["service-card"]}
                            description={data.serviceConcept.description}
                            showFullDescription={showFullDescription}
                            setShowFullDescription={setShowFullDescription}
                        />
                    </div>
                </div>
            </main>
        </motion.div>
    )
}

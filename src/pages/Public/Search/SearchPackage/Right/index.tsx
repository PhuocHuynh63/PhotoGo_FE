"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import Button from "@components/Atoms/Button"
import LucideIcon from "@components/Atoms/LucideIcon"
import Pagination from "@components/Organisms/Pagination/Pagination"
import Select from "@components/Atoms/Select"
import Link from "next/link"
// import { Badge } from "@/components/ui/badge"

interface ServicePackage {
    id: number
    vendor_id: number
    vendor_name: string
    vendor_location: string
    vendor_rating: number
    vendor_reviews: number
    name: string
    description: string
    price: number
    duration: number
    status: "active" | "inactive"
    created_at: string
    updated_at: string
    type: string[]
    image: string
}

const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
};

const allPackages: ServicePackage[] = [
    {
        id: 1,
        vendor_id: 1,
        vendor_name: "Studio Ánh Sáng",
        vendor_location: "Quận 1, TP Hồ Chí Minh",
        vendor_rating: 4.9,
        vendor_reviews: 128,
        name: "Gói chụp cưới cao cấp",
        description: "Gói chụp cưới trọn gói bao gồm trang phục, trang điểm và album cao cấp",
        price: 15000000,
        duration: 180, // 8 hours
        status: "active",
        created_at: "2023-01-15T00:00:00Z",
        updated_at: "2023-01-15T00:00:00Z",
        type: ["Chụp cưới"],
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744873764/343342550_5955920044504242_5222768225392896037_n_fvxjyh.jpg",
    },
    {
        id: 2,
        vendor_id: 1,
        vendor_name: "Studio Ánh Sáng",
        vendor_location: "Quận 1, TP Hồ Chí Minh",
        vendor_rating: 4.9,
        vendor_reviews: 128,
        name: "Chụp ảnh sản phẩm",
        description: "Chụp ảnh sản phẩm chuyên nghiệp cho thương hiệu và doanh nghiệp",
        price: 2500000,
        duration: 180, // 3 hours
        status: "active",
        created_at: "2023-02-10T00:00:00Z",
        updated_at: "2023-02-10T00:00:00Z",
        type: ["Chụp sản phẩm"],
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744873765/cach-chup-anh-san-pham-co-concept-758x400_p63t0c.jpg",
    },
    {
        id: 3,
        vendor_id: 2,
        vendor_name: "Nguyễn Văn Nhiếp",
        vendor_location: "Quận Cầu Giấy, Hà Nội",
        vendor_rating: 4.8,
        vendor_reviews: 96,
        name: "Chụp ảnh gia đình",
        description: "Gói chụp ảnh gia đình tại studio hoặc ngoại cảnh",
        price: 1800000,
        duration: 120, // 2 hours
        status: "active",
        created_at: "2023-03-05T00:00:00Z",
        updated_at: "2023-03-05T00:00:00Z",
        type: ["Chụp chân dung"],
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744873812/tvs2651-17049380698481496784986_su5yni.jpg",
    },
    {
        id: 4,
        vendor_id: 2,
        vendor_name: "Nguyễn Văn Nhiếp",
        vendor_location: "Quận Cầu Giấy, Hà Nội",
        vendor_rating: 4.8,
        vendor_reviews: 96,
        name: "Chụp sự kiện doanh nghiệp",
        description: "Dịch vụ chụp ảnh sự kiện doanh nghiệp chuyên nghiệp",
        price: 3500000,
        duration: 240, // 4 hours
        status: "active",
        created_at: "2023-04-20T00:00:00Z",
        updated_at: "2023-04-20T00:00:00Z",
        type: ["Sự kiện"],
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744873767/z5631845257738dcff9f7995a16408aad5ea4537819605-1-17209351695971446472688_ofvlth.jpg",
    },
    {
        id: 5,
        vendor_id: 3,
        vendor_name: "Elegant Studio",
        vendor_location: "Quận Ba Đình, Hà Nội",
        vendor_rating: 4.6,
        vendor_reviews: 112,
        name: "Chụp ảnh cưới ngoại cảnh",
        description: "Gói chụp ảnh cưới ngoại cảnh tại các địa điểm nổi tiếng",
        price: 12000000,
        duration: 360, // 6 hours
        status: "active",
        created_at: "2023-05-15T00:00:00Z",
        updated_at: "2023-05-15T00:00:00Z",
        type: ["Chụp cưới"],
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744873852/sapa_hayx9v.jpg",
    },
    {
        id: 6,
        vendor_id: 3,
        vendor_name: "Elegant Studio",
        vendor_location: "Quận Ba Đình, Hà Nội",
        vendor_rating: 4.6,
        vendor_reviews: 112,
        name: "Chụp ảnh chân dung nghệ thuật",
        description: "Chụp ảnh chân dung nghệ thuật với concept độc đáo",
        price: 1500000,
        duration: 90, // 1.5 hours
        status: "active",
        created_at: "2023-06-10T00:00:00Z",
        updated_at: "2023-06-10T00:00:00Z",
        type: ["Chụp chân dung"],
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744873763/jisoo-5753-1632298728-1417-1644390050_t0ckza.webp",
    },
    {
        id: 7,
        vendor_id: 4,
        vendor_name: "Lê Minh Photographer",
        vendor_location: "Quận Hải Châu, Đà Nẵng",
        vendor_rating: 4.8,
        vendor_reviews: 82,
        name: "Chụp ảnh du lịch",
        description: "Dịch vụ chụp ảnh du lịch cá nhân hoặc nhóm",
        price: 2000000,
        duration: 180, // 3 hours
        status: "active",
        created_at: "2023-07-05T00:00:00Z",
        updated_at: "2023-07-05T00:00:00Z",
        type: ["Chụp chân dung", "Sự kiện"],
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744874818/tai-sao-can-biet-cach-tao-dang-khi-chup-anh-2-1024x683_u3odis.jpg",
    },
    {
        id: 8,
        vendor_id: 4,
        vendor_name: "Lê Minh Photographer",
        vendor_location: "Quận Hải Châu, Đà Nẵng",
        vendor_rating: 4.8,
        vendor_reviews: 82,
        name: "Chụp ảnh sản phẩm cao cấp",
        description: "Chụp ảnh sản phẩm cao cấp với thiết bị chuyên nghiệp",
        price: 3000000,
        duration: 240, // 4 hours
        status: "inactive",
        created_at: "2023-08-15T00:00:00Z",
        updated_at: "2023-08-15T00:00:00Z",
        type: ["Chụp sản phẩm"],
        image: "/placeholder.svg?height=200&width=300",
    },
]

export default function Right() {
    const searchParams = useSearchParams()
    const [sortBy, setSortBy] = useState("")
    const [packages, setPackages] = useState<ServicePackage[]>([])
    const [loading, setLoading] = useState(false)
    const [resultCount, setResultCount] = useState(allPackages.length)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState("6");


    const handlePageSizeChange = (value: string) => {

        setItemsPerPage(value);
        setCurrentPage(1);
    };
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };


    const totalServices = allPackages.length;
    const totalPages = Math.ceil(totalServices / Number(itemsPerPage))

    const currentServices = packages.slice(
        (currentPage - 1) * Number(itemsPerPage),
        currentPage * Number(itemsPerPage)
    );
    // Format duration for display
    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes} phút`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`
    }

    // Mock data fetch with filters
    useEffect(() => {
        setLoading(true)

        // Get filter values from URL
        const typeFilter = searchParams?.get("serviceType")?.split(",") || []
        const minRating = Number(searchParams?.get("minRating")) || 0
        const minPrice = Number(searchParams?.get("minPrice")) || 0
        const maxPrice = Number(searchParams?.get("maxPrice")) || Number.POSITIVE_INFINITY
        const minDuration = Number(searchParams?.get("minDuration")) || 0
        const maxDuration = Number(searchParams?.get("maxDuration")) || Number.POSITIVE_INFINITY
        const vendorFilter = searchParams?.get("vendors")?.split(",") || []

        // Apply filters
        const filteredPackages = allPackages.filter((pkg) => {
            // Filter by status (only show active)
            if (pkg.status !== "active") return false

            // Filter by type
            if (typeFilter.length > 0 && !pkg.type.some((t) => typeFilter.includes(t))) return false

            // Filter by rating
            if (pkg.vendor_rating < minRating) return false

            // Filter by price
            if (pkg.price < minPrice || pkg.price > maxPrice) return false

            // Filter by duration
            if (pkg.duration < minDuration || pkg.duration > maxDuration) return false

            // Filter by vendor
            if (vendorFilter.length > 0 && !vendorFilter.includes(pkg.vendor_name)) return false

            return true
        })

        // Apply sorting
        const sortedPackages = [...filteredPackages]
        if (sortBy === "price-low") {
            sortedPackages.sort((a, b) => a.price - b.price)
        } else if (sortBy === "price-high") {
            sortedPackages.sort((a, b) => b.price - a.price)
        } else if (sortBy === "duration-low") {
            sortedPackages.sort((a, b) => a.duration - b.duration)
        } else if (sortBy === "duration-high") {
            sortedPackages.sort((a, b) => b.duration - a.duration)
        } else if (sortBy === "rating") {
            sortedPackages.sort((a, b) => b.vendor_rating - a.vendor_rating)
        }

        // Simulate API delay
        setTimeout(() => {
            setPackages(sortedPackages)
            setResultCount(sortedPackages.length)
            setLoading(false)
        }, 500)
    }, [searchParams, sortBy])

    return (
        <motion.div
            className="flex-1 pl-6 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="mb-6">
                <h2 className="text-lg font-medium">Kết quả tìm kiếm</h2>
                <p className="text-sm text-gray-500">Tìm thấy {resultCount} kết quả</p>
            </div>

            <div className="flex items-center justify-end mb-4">
                <div className="flex items-center">
                    <select className="border rounded-md p-1 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="relevant">Phù hợp nhất</option>
                        <option value="price-low">Giá thấp đến cao</option>
                        <option value="price-high">Giá cao đến thấp</option>
                        <option value="duration-low">Thời lượng ngắn nhất</option>
                        <option value="duration-high">Thời lượng dài nhất</option>
                        <option value="rating">Đánh giá cao nhất</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            ) : currentServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-search-x"
                    >
                        <path d="M10 10 2 2m8 8 8-8M2 10l8-8m0 16 8-8" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium">Không tìm thấy kết quả</h3>
                    <p className="mt-2 text-gray-500">Vui lòng thử lại với bộ lọc khác</p>
                </div>
            ) : (
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}
                >
                    {currentServices.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            className="border-3 rounded-lg overflow-hidden relative transition-transform duration-300 hover:border-orange-300"
                            initial="hidden"
                            variants={cardVariants}
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="absolute top-2 right-2 z-10">
                                <Button className="shadow-none hover:bg-none flex items-center justify-center">
                                    <LucideIcon name="Heart" iconSize={18} fill={pkg.status ? "red" : "none"} iconColor={pkg.status ? "red" : "black"} />
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="relative h-60">
                                    <Image src={pkg.image || "/placeholder.svg"} fill style={{
                                        objectFit: 'cover',
                                    }}
                                        loading="lazy" alt={pkg.name} />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                    <h3 className="text-white font-medium">{pkg.name}</h3>
                                    <div className="flex items-center text-white text-xs">
                                        <span className="flex items-center">{pkg.vendor_name}</span>
                                    </div>
                                    <div className="flex items-center text-white text-xs mt-1">
                                        <span>{pkg.vendor_location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3">
                                <div className="flex items-center mb-2">

                                    <div className="flex text-yellow-400">
                                        <LucideIcon name="Star" iconSize={14} fill="yellow" />
                                    </div>
                                    <span className="text-sm font-medium ml-1">

                                        {pkg.vendor_rating}</span>
                                    <span className="text-xs text-gray-500 ml-1">({pkg.vendor_reviews} đánh giá)</span>
                                </div>
                                <div className="flex items-center h-10">
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{pkg.description}</p>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {pkg.type.map((type, i) => (
                                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                            {type}
                                        </span>
                                    ))}
                                    {pkg.duration && (
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                            {formatDuration(pkg.duration)}
                                        </span>
                                    )}

                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-md">
                                        <span className="font-medium">{pkg.price.toLocaleString()}đ</span>
                                    </div>
                                    <Link href={`/packages/${pkg.id}`}>
                                        <Button>
                                            Xem chi tiết
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            )}

            {resultCount > Number(itemsPerPage) && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={totalPages}
                        onChange={handlePageChange}
                    />
                    {/* <Select
                        value={String(itemsPerPage)}
                        onValueChange={(value) => handlePageSizeChange(value)}
                        className="w-full"
                        options={[
                            { value: 5 },
                            { value: 10 },
                            { value: 50 },
                            { value: 100 },
                        ]}
                    /> */}
                </div>
            )}

        </motion.div>
    )
}

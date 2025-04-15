"use client"

import { useState } from "react"
import LucideIcon from "@components/Atoms/LucideIcon"
import Button from "@components/Atoms/Button"
import Select from "@components/Atoms/Select"
import Link from "next/link"
import { ROUTES } from "@routes"
import Pagination from "@components/Organisms/Pagination/Pagination"
import Image from "next/image"

const services: ICOMPONENTS.ServiceCard[] = [
    {
        id: 1,
        name: "Studio Ánh Sáng",
        type: ["Studio"],
        district: "Quận 1",
        city: "TP Hồ Chí Minh",
        rating: 4.9,
        reviewCount: 128,
        priceRange: [1200000, 5000000],
        categories: ["Chân dung", "Thời trang", "Sản phẩm"],
        image: "https://res.cloudinary.com/dodtzdovx/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1744624539/themyxungtoiko_pslpth.png",
        available: true,
        featured: true
    },
    {
        id: 2,
        name: "Nguyễn Văn Nhiếp",
        type: ["Nhiếp ảnh gia"],
        district: "Quận Cầu Giấy",
        city: "Hà Nội",
        rating: 4.8,
        reviewCount: 96,
        priceRange: [800000, 3500000],
        categories: ["Cưới", "Gia đình", "Sự kiện"],
        image: "/placeholder.svg?height=200&width=200",
        available: true,
        featured: true
    },
    {
        id: 3,
        name: "Trần Thị Makeup",
        type: ["Makeup Artist"],
        district: "Quận 2",
        city: "TP Hồ Chí Minh",
        rating: 4.7,
        reviewCount: 105,
        priceRange: [600000, 2000000],
        categories: ["Cô dâu", "Dạ tiệc", "Thời trang"],
        image: "/placeholder.svg?height=200&width=200",
        available: false,
        featured: true
    },
    {
        id: 4,
        name: "Elegant Studio",
        type: ["Studio"],
        district: "Quận Ba Đình",
        city: "Hà Nội",
        rating: 4.6,
        reviewCount: 112,
        priceRange: [1000000, 4500000],
        categories: ["Cưới", "Chân dung", "Gia đình"],
        image: "/placeholder.svg?height=200&width=200",
        available: true,
        featured: true
    },
    {
        id: 5,
        name: "Lê Minh Photographer",
        type: ["Nhiếp ảnh gia"],
        district: "Quận Hải Châu",
        city: "Đà Nẵng",
        rating: 4.8,
        reviewCount: 82,
        priceRange: [900000, 3800000],
        categories: ["Sự kiện", "Du lịch", "Gia đình"],
        image: "/placeholder.svg?height=200&width=200",
        available: true,
        featured: true
    },
    {
        id: 6,
        name: "Vũ Linh Makeup",
        type: ["Makeup Artist"],
        district: "Quận 7",
        city: "TP Hồ Chí Minh",
        rating: 4.9,
        reviewCount: 93,
        priceRange: [700000, 3000000],
        categories: ["Cô dâu", "Nghệ thuật", "Sân khấu"],
        image: "/placeholder.svg?height=200&width=200",
        available: true,
        featured: false
    },
    {
        id: 7,
        name: "Phương Nam Studio",
        type: ["Studio"],
        district: "Quận 3",
        city: "TP Hồ Chí Minh",
        rating: 4.5,
        reviewCount: 76,
        priceRange: [1000000, 4000000],
        categories: ["Gia đình", "Sản phẩm", "Doanh nghiệp"],
        image: "/placeholder.svg?height=200&width=200",
        available: false,
        featured: false
    },
    {
        id: 8,
        name: "Hoàng Anh Photographer",
        type: ["Nhiếp ảnh gia"],
        district: "Quận Hoàn Kiếm",
        city: "Hà Nội",
        rating: 4.7,
        reviewCount: 89,
        priceRange: [850000, 3200000],
        categories: ["Chân dung", "Thời trang", "Nghệ thuật"],
        image: "/placeholder.svg?height=200&width=200",
        available: false,
        featured: true
    },
]

export default function Right() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [sortBy, setSortBy] = useState("relevant")
    const [resultCount, setResultCount] = useState(6)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalServices = services.length;
    const totalPages = Math.ceil(totalServices / itemsPerPage);

    const currentServices = services.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    console.log('viewMode', viewMode, 'sortBy', sortBy, 'resultCount', resultCount)

    return (
        <div className="flex-1 pl-6 p-3">
            <div className="mb-6">
                <h2 className="text-lg font-medium">Kết quả tìm kiếm</h2>
                <p className="text-sm text-gray-500">Tìm thấy {resultCount} kết quả</p>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center rounded-lg">
                    <Button
                        className={`p-3 rounded-lg rounded-tr-none rounded-br-none ${viewMode === "grid" ? "text-light" : "text-dark bg-white"}`}
                        onClick={() => setViewMode("grid")}
                    >
                        <LucideIcon name="Grid2x2" />
                    </Button>
                    <Button
                        className={`p-3 rounded-lg rounded-tl-none rounded-bl-none ${viewMode === "list" ? "text-light" : "text-dark bg-white"}`}
                        onClick={() => setViewMode("list")}
                    >
                        <LucideIcon name="List" />
                    </Button>
                </div>
                <div className="flex justify-center">
                    <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
                </div>
                <div className="flex items-center">
                    <Select label="" options={["Phù hợp nhất", "Giá thấp đến cao", "Giá cao đến thấp", "Đánh giá cao nhất"]} className="w-40" value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
                </div>
            </div>

            <div
                className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid-cols-1 gap-4"}`}
            >
                {currentServices.map((service) => (
                    <div key={service.id} className="border rounded-lg overflow-hidden relative">
                        <div className="absolute top-2 right-2 z-10">
                            <Button className="p-2 rounded-full bg-white/80 hover:bg-gray-200 flex items-center justify-center">
                                <LucideIcon name="Heart" iconSize={18} fill={service.featured ? "red" : "none"} iconColor={service.featured ? "red" : "none"} className="text-gray-500" />
                            </Button>
                        </div>

                        {service.featured && (
                            <div className="absolute top-2 left-2 z-20">
                                <span className="bg-gray-200 text-dark text-sm font-semibold px-2 py-1 rounded-full">
                                    {service.featured ? "Nổi bật" : ""}
                                </span>
                            </div>
                        )}

                        <div className="relative bg-yellow-300">
                            {!service.available && (
                                <div className="absolute z-50 bg-black/60 w-full h-full flex items-center justify-center">
                                    <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                                        {service.available ? "Không có sẵn" : "Không có sẵn"}
                                    </span>
                                </div>
                            )}
                            <div className="relative h-50">
                                <Image src={service.image || "/placeholder.svg"} fill objectFit="cover" loading="lazy" alt={service.name} />
                            </div>
                        </div>

                        <div className="p-3">

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-start text-dark">
                                    <h3 className="text-dark font-medium text-lg">{service.name}</h3>
                                    <span className="text-dark text-xs flex">
                                        <LucideIcon name="MapPin" iconSize={14} />
                                        {service.district}, {service.city}
                                    </span>
                                </div>
                                <div className=" shadow-md flex items-center text-dark text-xs rounded-full border px-2 py-1">
                                    {service.type.map((type, i) => (
                                        <span key={i} className="flex items-center justify-center">
                                            {i > 0 && <span className="mx-1">•</span>}
                                            {type === "Studio" && (
                                                <LucideIcon iconSize={16} className="mr-1" name="Camera" />
                                            )}
                                            {type === "Nhiếp ảnh gia" && (
                                                <LucideIcon iconSize={16} className="mr-1" name="User" />
                                            )}
                                            {type === "Makeup Artist" && (
                                                <LucideIcon iconSize={16} className="mr-1" name="Paintbrush" />
                                            )}
                                            {type}
                                        </span>
                                    ))}
                                </div>

                            </div>

                            <div className="flex items-center mb-2">

                                <div className="flex text-yellow-400">
                                    <LucideIcon name="Star" iconSize={14} fill="yellow" />
                                </div>
                                <span className="text-sm font-medium ml-1">

                                    {service.rating}</span>
                                <span className="text-xs text-gray-500 ml-1">({service.reviewCount} đánh giá)</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                                {service.categories.map((category, i) => (
                                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                        {category}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm">
                                    <span className="font-medium">
                                        {service.priceRange[0].toLocaleString()}đ - {service.priceRange[1].toLocaleString()}đ
                                    </span>
                                </div>
                                <Link href={ROUTES.PUBLIC.HOME} >
                                    <Button width={80} disabled={!service.available} className="bg-primary text-white text-sm px-3 py-1 rounded-md">
                                        Đặt lịch
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )
}

"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

type ServiceType = "Studio" | "Nhiếp ảnh gia" | "Makeup Artist"

interface ServiceCard {
    id: number
    name: string
    type: ServiceType[]
    district: string
    city: string
    rating: number
    reviewCount: number
    priceRange: [number, number]
    categories: string[]
    image: string
    available: boolean
}

export default function Right() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [sortBy, setSortBy] = useState("relevant")

    const services: ServiceCard[] = [
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
            image: "/placeholder.svg?height=200&width=200",
            available: true,
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
            available: true,
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
        },
    ]

    return (
        <div className="flex-1 pl-6">
            <div className="mb-6">
                <h2 className="text-lg font-medium">Kết quả tìm kiếm</h2>
                <p className="text-sm text-gray-500">Tìm thấy 8 kết quả</p>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <button
                        className={`p-2 rounded ${viewMode === "grid" ? "bg-orange-100 text-orange-500" : "bg-gray-100"}`}
                        onClick={() => setViewMode("grid")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-grid"
                        >
                            <rect width="7" height="7" x="3" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="14" rx="1" />
                            <rect width="7" height="7" x="3" y="14" rx="1" />
                        </svg>
                    </button>
                    <button
                        className={`p-2 rounded ${viewMode === "list" ? "bg-orange-100 text-orange-500" : "bg-gray-100"}`}
                        onClick={() => setViewMode("list")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-list"
                        >
                            <line x1="8" x2="21" y1="6" y2="6" />
                            <line x1="8" x2="21" y1="12" y2="12" />
                            <line x1="8" x2="21" y1="18" y2="18" />
                            <line x1="3" x2="3.01" y1="6" y2="6" />
                            <line x1="3" x2="3.01" y1="12" y2="12" />
                            <line x1="3" x2="3.01" y1="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center">
                    <span className="text-sm mr-2">Phụ hạng nghề</span>
                    <select className="border rounded-md p-1 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="relevant">Phù hợp nhất</option>
                        <option value="price-low">Giá thấp đến cao</option>
                        <option value="price-high">Giá cao đến thấp</option>
                        <option value="rating">Đánh giá cao nhất</option>
                    </select>
                </div>
            </div>

            <div
                className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid-cols-1 gap-4"}`}
            >
                {services.map((service) => (
                    <div key={service.id} className="border rounded-lg overflow-hidden relative">
                        <div className="absolute top-2 right-2 z-10">
                            <button className="p-1 rounded-full bg-white/80 hover:bg-white">
                                <Heart size={18} className="text-gray-500" />
                            </button>
                        </div>

                        {!service.available && (
                            <div className="absolute top-2 left-2 z-10">
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {service.id === 3 ? "Không có sẵn" : "Không có sẵn"}
                                </span>
                            </div>
                        )}

                        <div className="relative">
                            <img src={service.image || "/placeholder.svg"} alt={service.name} className="w-full h-48 object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                <h3 className="text-white font-medium">{service.name}</h3>
                                <div className="flex items-center text-white text-xs">
                                    {service.type.map((type, i) => (
                                        <span key={i} className="flex items-center">
                                            {i > 0 && <span className="mx-1">•</span>}
                                            {type === "Studio" && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-camera mr-1"
                                                >
                                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                                    <circle cx="12" cy="13" r="3" />
                                                </svg>
                                            )}
                                            {type === "Nhiếp ảnh gia" && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-user mr-1"
                                                >
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            )}
                                            {type === "Makeup Artist" && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-sparkles mr-1"
                                                >
                                                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                                                    <path d="M5 3v4" />
                                                    <path d="M19 17v4" />
                                                    <path d="M3 5h4" />
                                                    <path d="M17 19h4" />
                                                </svg>
                                            )}
                                            {type}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center text-white text-xs mt-1">
                                    <span>
                                        {service.district}, {service.city}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3">
                            <div className="flex items-center mb-2">
                                <div className="flex text-yellow-400">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium ml-1">{service.rating}</span>
                                <span className="text-xs text-gray-500 ml-1">({service.reviewCount} đánh giá)</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                                {service.categories.map((category, i) => (
                                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
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
                                <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1 rounded">
                                    Xem tiếp
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                    <button className="px-2 py-1 rounded border text-gray-500 hover:bg-gray-50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-left"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button className="px-3 py-1 rounded border bg-orange-500 text-white">1</button>
                    <button className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-50">3</button>
                    <span className="px-2 py-1 text-gray-500">...</span>
                    <button className="px-2 py-1 rounded border text-gray-500 hover:bg-gray-50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-right"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    )
}

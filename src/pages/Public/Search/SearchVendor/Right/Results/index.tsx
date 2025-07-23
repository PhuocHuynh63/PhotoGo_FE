"use client"

import { useState, useEffect } from "react"
import LucideIcon from "@components/Atoms/LucideIcon"
import { ROUTES } from "@routes"
import Pagination from "@components/Organisms/Pagination/Pagination"
import Image from "next/image"
import { motion } from "framer-motion"
import { IVendorsData } from "@models/vendor/response.model"
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@components/Atoms/ui/skeleton"


const cardVariants = {
    hidden: { opacity: 0, scale: 1 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1 }
};


export default function Right({ vendors }: { vendors: IVendorsData }) {
    const resultCount = vendors?.pagination.totalItem
    const [currentPage, setCurrentPage] = useState(vendors?.pagination.current);
    const searchParams = useSearchParams();
    const router = useRouter();
    const totalPages = vendors?.pagination.totalPage
    useEffect(() => {
        const current = searchParams?.get('current');
        if (current) {
            setCurrentPage(Number(current));
        } else {
            setCurrentPage(1);
        }
    }, [searchParams]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const params = new URLSearchParams(searchParams?.toString());
        if (newPage) {
            params.set('current', newPage.toString());
        } else {
            params.delete('current');
        }
        router.push(`?${params.toString()}`);
    };

    const handleNavigationVendorDetail = (slug: string, district: string) => {
        const basePath = ROUTES.PUBLIC.VENDOR_DETAIL.replace(":slug", slug).replace(":page", "");
        const query = `?location=${encodeURIComponent(district)}`;
        router.push(`${basePath}${query}`);
    };

    return (
        <div className="flex-1 pl-6 p-3 border-l-2">
            <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-medium pb-2">Kết quả tìm kiếm</h2>
                        <p className="text-sm text-gray-500">Tìm thấy <span className="font-medium">{resultCount}</span> kết quả</p>
                    </div>
                </div>
            </motion.div>

            {!vendors ? (
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <motion.div
                            key={index}
                            className="border-3 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            {/* Featured badge skeleton */}
                            <div className="relative">
                                {/* Occasional featured badge */}
                                {index % 3 === 0 && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <div className="h-6 w-16 rounded-full animate-shimmer" />
                                    </div>
                                )}

                                {/* Image skeleton with shimmer */}
                                <div className="relative h-60 border-b-2 animate-shimmer rounded-t-lg overflow-hidden">
                                </div>
                            </div>

                            <div className="p-3 space-y-3">
                                {/* Title and location skeleton */}
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 space-y-2">
                                        {/* Vendor name - 2 lines with different widths */}
                                        <div className="space-y-2">
                                            <div className="h-5 w-full rounded animate-shimmer" />
                                            <div className="h-5 w-2/3 rounded animate-shimmer" />
                                        </div>
                                        {/* Location with icon space */}
                                        <div className="flex items-center space-x-1">
                                            <div className="h-3 w-3 rounded animate-shimmer" />
                                            <div className="h-3 w-3/4 rounded animate-shimmer" />
                                        </div>
                                    </div>
                                    {/* Distance badge */}
                                    <div className="h-7 w-14 rounded-full flex-shrink-0 animate-shimmer" />
                                </div>

                                {/* Rating skeleton */}
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 rounded animate-shimmer" />
                                    <div className="h-4 w-8 rounded animate-shimmer" />
                                    <div className="h-3 w-16 rounded animate-shimmer" />
                                </div>

                                {/* Category tags skeleton */}
                                <div className="flex flex-wrap gap-1">
                                    <div className="h-6 w-20 rounded-full animate-shimmer" />
                                    {index % 2 === 0 && <div className="h-6 w-16 rounded-full animate-shimmer" />}
                                </div>

                                {/* Price range skeleton */}
                                <div className="flex justify-between items-center">
                                    <div className="h-5 w-36 rounded animate-shimmer" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : vendors.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Image
                        src="/not-found.svg"
                        alt="Không tìm thấy kết quả"
                        width={200}
                        height={200}
                        className="mb-4"
                    />
                    <p className="text-gray-500 text-lg font-medium">Không tìm thấy kết quả phù hợp</p>
                    <p className="text-gray-400 text-sm mt-2">Vui lòng thử lại với các bộ lọc khác</p>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-end mb-4">
                        {/* <div className="flex items-center rounded-lg">
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
                </div> */}

                        {/* <div className="flex items-center">
                    <Select options={[{ value: "Phù hợp nhất" }, { value: "Giá thấp đến cao" }, { value: "Giá cao đến thấp" }, { value: "Đánh giá cao nhất" }]} className="cursor-pointer" value={sortBy} onValueChange={(e) => setSortBy(e)} />
                </div> */}
                    </div>

                    <div
                        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}
                    >
                        {vendors?.data.map((vendor, index) => (
                            <motion.div
                                key={index}
                                className="border-3 rounded-lg overflow-hidden relative transition-transform duration-300 hover:border-orange-300 cursor-pointer"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                onClick={() => handleNavigationVendorDetail(vendor.slug, vendor.locations[0]?.district || "")}
                            >
                                {vendor?.isRemarkable && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <span className="box bg-orange-300 text-white text-sm font-semibold px-2 py-1 rounded-full shadow-lg">
                                            Nổi bật
                                        </span>
                                    </div>
                                )}

                                <div className="relative">
                                    {!vendor.status && (
                                        <div className="absolute z-10 bg-black/60 w-full h-full flex items-center justify-center">
                                            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                                                {vendor.status}
                                            </span>
                                        </div>
                                    )}
                                    <div className="relative h-60 border-b-2">
                                        {vendor.logo ? (
                                            <Image
                                                src={vendor.logo || "data:image/svg+xml;base64," + btoa(`
                                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <defs>
                                                        <linearGradient id="placeholderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#F8F8F8" />
                                                            <stop offset="100%" stopColor="#E0E0E0" />
                                                        </linearGradient>
                                                    </defs>
                                                    <rect width="100" height="100" fill="url(#placeholderGradient)"/>
                                                    <circle cx="50" cy="40" r="15" fill="#D0D0D0"/>
                                                    <rect x="30" y="60" width="40" height="20" rx="5" fill="#D0D0D0"/>
                                                </svg>
                                            `)}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                priority={index < 3}
                                                loading={index < 3 ? "eager" : "lazy"}
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                                alt={vendor.name}
                                            />
                                        ) : (
                                            <Skeleton className="w-full h-full object-cover bg-gray-200" />
                                        )}
                                    </div>
                                </div>

                                <div className="p-3">

                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col items-start text-dark flex-1">
                                            <h3 className="text-dark font-medium text-lg h-16 line-clamp-2">{vendor.name}</h3>
                                            <span className="text-dark text-xs flex">
                                                <LucideIcon name="MapPin" iconSize={14} />
                                                {vendor.locations[0]?.address}, {vendor.locations[0]?.district}, {vendor.locations[0]?.ward}, {vendor.locations[0]?.city}
                                            </span>
                                        </div>
                                        {vendor.distance && (
                                            <div className="rounded-full border px-2 py-1 flex items-center justify-center">
                                                <span className="flex items-center justify-center w-full text-xs">
                                                    {vendor.distance ? `${vendor.distance.toFixed(1)} km` : "Không xác định"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center mb-2">

                                        <div className="flex text-yellow-400">
                                            <LucideIcon name="Star" iconSize={14} fill="yellow" />
                                        </div>
                                        <span className="text-sm font-medium ml-1">
                                            {vendor?.averageRating}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">({vendor?.reviews?.length} đánh giá)</span>
                                    </div>


                                    <div className="flex flex-wrap gap-1 mb-2">
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                            {vendor?.category?.name}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-sm">
                                            <span className="font-medium">

                                                {vendor.minPrice && vendor.maxPrice ? `${vendor.minPrice?.toLocaleString()}đ - ${vendor.maxPrice?.toLocaleString()}đ` : "Vui lòng liên hệ nhà cung cấp"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-center my-4">
                        <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
                    </div>
                </>
            )}
        </div>
    )
}

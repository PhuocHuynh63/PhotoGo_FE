"use client"

import { useState, useEffect } from "react"
import LucideIcon from "@components/Atoms/LucideIcon"
import Button from "@components/Atoms/Button"
import { ROUTES } from "@routes"
import Pagination from "@components/Organisms/Pagination/Pagination"
import Image from "next/image"
import { motion } from "framer-motion"
import { IVendorsData } from "@models/vendor/response.model"
import { useRouter, useSearchParams } from "next/navigation";


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
    console.log(
        vendors
    )
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

    return (
        <div className="flex-1 pl-6 p-3">
            <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-3xl font-medium pb-2">Kết quả tìm kiếm</h2>
                <p className="text-sm text-gray-500">Tìm thấy <span className="font-medium">{resultCount}</span> kết quả</p>
            </motion.div>

            {vendors?.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Image
                        src="/not-found.svg"
                        alt="Không tìm thấy kết quả"
                        width={200}
                        height={200}
                    />
                    <p className="mt-4 text-gray-500">Không tìm thấy kết quả phù hợp</p>
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
                        {vendors?.data.map((vendor) => (
                            <motion.div
                                key={vendor.id}
                                className="border-3 rounded-lg overflow-hidden relative transition-transform duration-300 hover:border-orange-300 cursor-pointer"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                onClick={() => router.push(`${ROUTES.PUBLIC.VENDOR_DETAIL.replace(":slug", vendor.slug).replace(":page", "")}`)}
                            >
                                {/* <div className="absolute top-2 right-2 z-10">
                                    <Button className="shadow-none hover:bg-none flex items-center justify-center">
                                        <LucideIcon name="Heart" iconSize={18} fill={vendor.featured ? "red" : "none"} iconColor={vendor.featured ? "red" : "black"} />
                                    </Button>
                                </div>

                                {vendor.featured && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <span className="bg-gray-200 text-dark text-sm font-semibold px-2 py-1 rounded-full shadow-lg">
                                            Nổi bật
                                        </span>
                                    </div>
                                )} */}

                                <div className="relative bg-yellow-300">
                                    {!vendor.status && (
                                        <div className="absolute z-10 bg-black/60 w-full h-full flex items-center justify-center">
                                            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                                                {vendor.status}
                                            </span>
                                        </div>
                                    )}
                                    <div className="relative h-60">
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
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            loading="lazy"
                                            alt={vendor.name}
                                        />
                                    </div>
                                </div>

                                <div className="p-3">

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-start text-dark">
                                            <h3 className="text-dark font-medium text-lg">{vendor.name}</h3>
                                            <span className="text-dark text-xs flex">
                                                <LucideIcon name="MapPin" iconSize={14} />
                                                {vendor.locations[0]?.address}, {vendor.locations[0]?.city}
                                            </span>
                                        </div>
                                        <div className="rounded-full border px-2 py-1 flex items-center justify-center">
                                            {vendor.category && (
                                                <span className="flex items-center justify-center w-full">
                                                    {vendor.category.id === "C001" && (
                                                        <LucideIcon iconSize={16} name="MapPinHouse" />
                                                    )}
                                                    {vendor.category.id === "C003" && (
                                                        <LucideIcon iconSize={16} name="User" />
                                                    )}
                                                    {vendor.category.id === "C002" && (
                                                        <LucideIcon iconSize={16} name="Paintbrush" />
                                                    )}
                                                    {vendor.category.id === "CAT002" && (
                                                        <LucideIcon iconSize={16} name="PartyPopper" />
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                    <div className="flex items-center mb-2">

                                        <div className="flex text-yellow-400">
                                            <LucideIcon name="Star" iconSize={14} fill="yellow" />
                                        </div>
                                        <span className="text-sm font-medium ml-1">
                                            {/* {vendor.rating} */}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">({/*{vendor?.reviews?.length}*/} đánh giá)</span>
                                    </div>


                                    <div className="flex flex-wrap gap-1 mb-2">
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                            {vendor?.category?.name}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-sm">
                                            <span className="font-medium">
                                                {/* {vendor.priceRange[0].toLocaleString()}đ - {vendor.priceRange[1].toLocaleString()}đ */}
                                            </span>
                                        </div>
                                        <Button
                                            width={80}
                                            disabled={!vendor.status}
                                            className="z-10 bg-primary text-white text-sm px-3 py-1 rounded-md"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/book/${vendor.id}`);
                                            }}
                                        >
                                            Đặt lịch
                                        </Button>
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

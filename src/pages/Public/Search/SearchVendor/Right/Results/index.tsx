"use client"

import { useState } from "react"
import LucideIcon from "@components/Atoms/LucideIcon"
import Button from "@components/Atoms/Button"
import Link from "next/link"
import { ROUTES } from "@routes"
import Pagination from "@components/Organisms/Pagination/Pagination"
import Image from "next/image"
import { motion } from "framer-motion"
import { IVendor } from "@models/vendor/common.model"



const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
};

export default function Right({ vendors }: { vendors: IVendor[] }) {
    const resultCount = vendors.length
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalServices = vendors.length;
    const totalPages = Math.ceil(totalServices / itemsPerPage);

    const currentServices = vendors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <div className="flex-1 pl-6 p-3">
            <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-lg font-medium">Kết quả tìm kiếm</h2>
                <p className="text-sm text-gray-500">Tìm thấy {resultCount} kết quả</p>
            </motion.div>

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
                {currentServices.map((service, index) => (
                    <motion.div
                        key={service.id}
                        className="border-3 rounded-lg overflow-hidden relative transition-transform duration-300 hover:border-orange-300"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        {/* <div className="absolute top-2 right-2 z-10">
                            <Button className="shadow-none hover:bg-none flex items-center justify-center">
                                <LucideIcon name="Heart" iconSize={18} fill={service.featured ? "red" : "none"} iconColor={service.featured ? "red" : "black"} />
                            </Button>
                        </div>

                        {service.featured && (
                            <div className="absolute top-2 left-2 z-10">
                                <span className="bg-gray-200 text-dark text-sm font-semibold px-2 py-1 rounded-full shadow-lg">
                                    Nổi bật
                                </span>
                            </div>
                        )} */}

                        <div className="relative bg-yellow-300">
                            {!service.status && (
                                <div className="absolute z-10 bg-black/60 w-full h-full flex items-center justify-center">
                                    <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                                        {service.status}
                                    </span>
                                </div>
                            )}
                            <div className="relative h-60">
                                <Image src={service.logo || "/placeholder.svg"} fill style={{
                                    objectFit: 'cover',
                                }}
                                    loading="lazy" alt={service.name} />
                            </div>
                        </div>

                        <div className="p-3">

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-start text-dark">
                                    <h3 className="text-dark font-medium text-lg">{service.name}</h3>
                                    <span className="text-dark text-xs flex">
                                        <LucideIcon name="MapPin" iconSize={14} />
                                        {service.locations[0]?.address}, {service.locations[0]?.city}
                                    </span>
                                </div>
                                <div className=" shadow-md flex items-center text-dark text-xs rounded-full border px-2 py-1">
                                    {/* {service.type.map((type, i) => (
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
                                    ))} */}
                                </div>

                            </div>

                            <div className="flex items-center mb-2">

                                <div className="flex text-yellow-400">
                                    <LucideIcon name="Star" iconSize={14} fill="yellow" />
                                </div>
                                <span className="text-sm font-medium ml-1">

                                    {/* {service.rating} */}
                                </span>
                                <span className="text-xs text-gray-500 ml-1">({service.reviews.length} đánh giá)</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                                {/* {service.categories.map((category, i) => (
                                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                        {category}
                                    </span>
                                ))} */}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm">
                                    <span className="font-medium">
                                        {/* {service.priceRange[0].toLocaleString()}đ - {service.priceRange[1].toLocaleString()}đ */}
                                    </span>
                                </div>
                                <Link href={ROUTES.PUBLIC.HOME} >
                                    <Button width={80} disabled={!service.status} className="bg-primary text-white text-sm px-3 py-1 rounded-md">
                                        Đặt lịch
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-center my-4">
                <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
            </div>
        </div>
    )
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@components/Atoms/Button";
import { Card } from "@components/Atoms/Card";
import { Heart, Star } from "lucide-react";
import { Skeleton } from "@components/Atoms/ui/skeleton";
import Pagination from "@components/Organisms/Pagination/Pagination";

export default function FavoritesContent() {
    const [favorites, setFavorites] = useState([
        {
            id: 1,
            name: "Sản phẩm 1",
            image: "/placeholder.svg",
            price: 100000,
            rating: 4.5,
            vendor: "Nhà cung cấp 1",
            reviews: 10,
        },
        {
            id: 2,
            name: "Sản phẩm 2",
            image: "/placeholder.svg",
            price: 200000,
            rating: 4.0,
            vendor: "Nhà cung cấp 2",
            reviews: 5,
        },
        {
            id: 3,
            name: "Sản phẩm 3",
            image: "/placeholder.svg",
            price: 300000,
            rating: 4.8,
            vendor: "Nhà cung cấp 3",
            reviews: 15,
        },
        {
            id: 4,
            name: "Sản phẩm 4",
            image: "/placeholder.svg",
            price: 400000,
            rating: 4.2,
            vendor: "Nhà cung cấp 4",
            reviews: 8,
        },
        {
            id: 5,
            name: "Sản phẩm 5",
            image: "/placeholder.svg",
            price: 500000,
            rating: 4.7,
            vendor: "Nhà cung cấp 5",
            reviews: 12,
        },
        {
            id: 6,
            name: "Sản phẩm 6",
            image: "/placeholder.svg",
            price: 600000,
            rating: 4.3,
            vendor: "Nhà cung cấp 6",
            reviews: 7,
        },
        {
            id: 7,
            name: "Sản phẩm 7",
            image: "/placeholder.svg",
            price: 700000,
            rating: 4.9,
            vendor: "Nhà cung cấp 7",
            reviews: 20,
        },
        {
            id: 8,
            name: "Sản phẩm 8",
            image: "/placeholder.svg",
            price: 700000,
            rating: 4.9,
            vendor: "Nhà cung cấp 8",
            reviews: 20,
        },
        {
            id: 9,
            name: "Sản phẩm 9",
            image: "/placeholder.svg",
            price: 700000,
            rating: 4.9,
            vendor: "Nhà cung cấp 9",
            reviews: 20,
        },
        {
            id: 10,
            name: "Sản phẩm 10",
            image: "/placeholder.svg",
            price: 700000,
            rating: 4.9,
            vendor: "Nhà cung cấp 10",
            reviews: 20,
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handleRemove = (id: number) => {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.3 } },
    };

    // Calculate pagination
    const totalPages = Math.ceil(favorites.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedFavorites = favorites.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
                Danh sách yêu thích
            </h1>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-40 w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : favorites.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {paginatedFavorites.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                >
                                    <Card className="hover:shadow-lg transition-shadow duration-300 group rounded-2xl overflow-hidden border">
                                        <div className="relative h-44 sm:h-48 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleRemove(item.id)}
                                                className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white text-red-500 shadow-sm rounded-full"
                                            >
                                                <Heart className="h-4 w-4 fill-current" />
                                            </Button>
                                        </div>

                                        <div className="p-4 space-y-1">
                                            <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.vendor}</p>

                                            <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                                                <div className="flex items-center text-yellow-500">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <span className="ml-1 text-sm">{item.rating}</span>
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        ({item.reviews} đánh giá)
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-primary text-sm">
                                                    {item.price.toLocaleString()}đ
                                                </p>
                                            </div>

                                            <Button className="w-full mt-4 text-sm font-medium text-white">
                                                Xem chi tiết
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                total={totalPages}
                                current={currentPage}
                                onChange={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center mt-12 text-center text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 text-gray-300 mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                    </svg>
                    <p className="text-lg font-medium">Bạn chưa có sản phẩm yêu thích nào.</p>
                    <p className="text-sm mt-1">Hãy khám phá và thêm vào danh sách yêu thích nhé!</p>
                </div>
            )}
        </div>
    );
}

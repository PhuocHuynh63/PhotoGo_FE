"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@components/Atoms/Button";
import { Card } from "@components/Atoms/Card";
import { Heart, Star } from "lucide-react";

import Pagination from "@components/Organisms/Pagination/Pagination";
import { IFavoriteDetailModel } from "@models/favorite/common.model";
import favoritesService from "@services/favorites";
import toast from "react-hot-toast";

export default function FavoritesContent({ itemsData }: { itemsData: IFavoriteDetailModel[] }) {
    const router = useRouter();
    const [favorites, setFavorites] = useState(itemsData)
    const [currentPage, setCurrentPage] = useState(1);
    const [removingItems, setRemovingItems] = useState<string[]>([]);
    const itemsPerPage = 6;

    const handleRemove = async (item: IFavoriteDetailModel) => {
        try {
            setRemovingItems(prev => [...prev, item.id]);

            await favoritesService.removeFavorite(item.wishlistId, item.id);

            setFavorites((prev) => prev.filter((favItem) => favItem.id !== item.id));
            toast.success('Đã xóa khỏi danh sách yêu thích');
        } catch (error) {
            toast.error(error as string);
        } finally {
            setRemovingItems(prev => prev.filter(id => id !== item.id));
        }
    };

    // Function để lấy vendor slug - bạn cần implement logic này
    const getVendorSlug = async (serviceConceptId: string): Promise<string | null> => {
        try {
            // TODO: Implement API call để lấy vendor slug từ service concept ID
            // Ví dụ:
            // const response = await fetch(`/api/service-concepts/${serviceConceptId}/vendor`);
            // const vendor = await response.json();
            // return vendor.slug;

            // Temporarily suppress unused parameter warning
            console.log('Service concept ID:', serviceConceptId);

            // Tạm thời return default vendor slug
            console.warn('Vendor slug fetch not implemented yet. Using default slug.');
            return "maboo-studio";
        } catch (error) {
            console.error('Error fetching vendor slug:', error);
            return null;
        }
    };

    const handleViewDetail = async (item: IFavoriteDetailModel) => {
        try {
            const vendorSlug = await getVendorSlug(item.serviceConcept.id);

            if (!vendorSlug) {
                console.error('Could not get vendor slug for concept:', item.serviceConcept.id);
                // TODO: Show user error message
                return;
            }

            // Navigate đến trang packages với concept ID
            router.push(`/${vendorSlug}/packages?conceptId=${item.serviceConcept.id}`);
        } catch (error) {
            console.error('Error navigating to vendor detail:', error);
            // TODO: Show user error message
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.3 } },
    };

    // Calculate pagination
    const totalPages = Math.ceil(favorites?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedFavorites = favorites?.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
                Danh sách yêu thích
            </h1>

            {favorites?.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {paginatedFavorites?.map((item) => (
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
                                                src={item.serviceConcept.images?.[0] || '/placeholder-image.jpg'}
                                                alt={item.serviceConcept.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleRemove(item)}
                                                disabled={removingItems.includes(item.id)}
                                                className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white text-red-500 shadow-sm rounded-full disabled:opacity-50"
                                            >
                                                <Heart className={`h-4 w-4 ${removingItems.includes(item.id) ? 'animate-pulse' : 'fill-current'}`} />
                                            </Button>
                                        </div>

                                        <div className="p-4 space-y-1">
                                            <h3 className="font-semibold text-lg truncate">{item.serviceConcept.name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">
                                                {item.serviceConcept.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                                                <div className="flex items-center text-yellow-500">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <span className="ml-1 text-sm">4.8</span>
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        (120 đánh giá)
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-primary text-sm">
                                                    {Number(item.serviceConcept.price).toLocaleString()}đ
                                                </p>
                                            </div>

                                            <div className="text-xs text-gray-500 mt-2">
                                                Thời gian: {item.serviceConcept.duration} phút
                                            </div>

                                            <Button
                                                className="w-full mt-4 text-sm font-medium text-white"
                                                onClick={() => handleViewDetail(item)}
                                            >
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

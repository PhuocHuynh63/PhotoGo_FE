"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@components/Atoms/Button";
import { Card } from "@components/Atoms/Card";
import { Heart } from "lucide-react";

import Pagination from "@components/Organisms/Pagination/Pagination";
import { IFavoriteDetailModel } from "@models/favorite/common.model";
import favoritesService from "@services/favorites";
import toast from "react-hot-toast";
import { IPagination } from "@models/metadata";
import conceptService from "@services/concept";
import { IInvoiceServiceModel } from "@models/serviceConcepts/common.model";
import { IServiceConceptResponseModel } from "@models/serviceConcepts/response.model";
import packageService from "@services/packageServices";
import { IServicePackageResponse } from "@models/servicePackages/response.model";
import { IVendor } from "@models/vendor/common.model";
import { SERVICE_CONCEPT } from "@constants/serviceConcept";
import { ROUTES } from "@routes";

export default function FavoritesContent({ itemsData, favoritePagination }: { itemsData: IFavoriteDetailModel[], favoritePagination: IPagination }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [favorites, setFavorites] = useState<IFavoriteDetailModel[]>(() => {
        return itemsData || [];
    });
    const [removingItems, setRemovingItems] = useState<string[]>([]);
    const [isChangingPage, setIsChangingPage] = useState(false);

    // Reset loading state and update favorites when new data arrives
    useEffect(() => {
        setFavorites(itemsData);
        setIsChangingPage(false);
    }, [itemsData]);

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
    const getVendorSlug = async (serviceConceptId: string): Promise<{ slug: string, location: string } | null> => {
        try {
            // TODO: Implement API call để lấy vendor slug từ service concept ID
            // Ví dụ:
            const response = await conceptService.getAServiceConceptById(serviceConceptId) as IServiceConceptResponseModel;
            const concept = response.data as unknown as IInvoiceServiceModel;

            //get vendor slug from concept
            const servicePackage = await packageService.getPackageById(concept?.servicePackageId) as IServicePackageResponse;
            const vendor = (servicePackage?.data?.vendor ?? {}) as IVendor;
            const vendorData = {
                slug: vendor?.slug,
                location: vendor?.locations[0].district
            }
            return vendorData;
        } catch (error) {
            console.error('Error fetching vendor slug:', error);
            return null;
        }
    };

    const handleViewDetail = async (item: IFavoriteDetailModel) => {
        try {
            const vendorData = await getVendorSlug(item.serviceConcept.id);

            if (!vendorData) {
                console.error('Could not get vendor slug for concept:', item.serviceConcept.id);
                toast.error('Không tìm thấy nhà cung cấp');
                return;
            }

            // Navigate đến trang packages với concept ID
            router.push(`/${vendorData.slug}/packages?conceptId=${item.serviceConcept.id}&location=${vendorData.location}`);
        } catch (error) {
            console.error('Error navigating to vendor detail:', error);
            toast.error('Lỗi khi xem chi tiết');
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.3 } },
    };

    const handlePageChange = (page: number) => {
        setIsChangingPage(true);
        // Create new URLSearchParams object
        const params = new URLSearchParams(searchParams?.toString() || '');
        // Update the page parameter
        params.set('page', page.toString());

        // Update URL with new search params, without forcing a navigation
        router.replace(`${ROUTES.USER.PROFILE.FAVORITES}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
                Danh sách yêu thích
            </h1>

            {isChangingPage ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : favorites?.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {favorites?.map((item) => (
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
                                            <Image
                                                src={item.serviceConcept.images?.[0] || '/placeholder-image.jpg'}
                                                alt={item.serviceConcept.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                                            <div
                                                className="text-muted-foreground prose prose-sm max-w-none line-clamp-2 overflow-hidden h-12"
                                                dangerouslySetInnerHTML={{ __html: item.serviceConcept.description || '' }}
                                            />

                                            <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                                                {/* <div className="flex items-center text-yellow-500">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <span className="ml-1 text-sm">4.8</span>
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        (120 đánh giá)
                                                    </span>
                                                </div> */}
                                                <p className="font-semibold text-primary text-sm">
                                                    {Number(item.serviceConcept.price).toLocaleString()}đ
                                                </p>
                                            </div>

                                            <div className="text-xs text-gray-500 mt-2">
                                                {item.serviceConcept.conceptRangeType === SERVICE_CONCEPT.CONCEPT_RANGE_TYPE.ONE_DAY && `Thời gian: ${item.serviceConcept.duration} phút`}
                                                {item.serviceConcept.conceptRangeType === SERVICE_CONCEPT.CONCEPT_RANGE_TYPE.MANY_DAYS && `Thời gian: ${item.serviceConcept.numberOfDays} ngày`}
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
                    {favoritePagination.totalPage > 1 && (
                        <div className="mt-8">
                            <Pagination
                                total={favoritePagination.totalPage}
                                current={favoritePagination.current}
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center text-gray-500">
                    <div className="flex items-center justify-center w-24 h-24 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full text-gray-300"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium">Bạn chưa có sản phẩm yêu thích nào.</p>
                    <p className="text-sm mt-1">Hãy khám phá và thêm vào danh sách yêu thích nhé!</p>
                </div>
            )}
        </div>
    );
}

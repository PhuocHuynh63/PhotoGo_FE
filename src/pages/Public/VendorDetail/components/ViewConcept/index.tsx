"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Molecules/Dialog";
import { Calendar, Loader2, Heart, X, Info, ShoppingCart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { IServicePackage } from "@models/servicePackages/common.model";
import { IServiceConcept } from "@models/serviceConcepts/common.model";
import EnhancedBookingPopup from "../EnhancedBookingPopup";
import { useAddToCart, useCart } from "@stores/cart/selectors";
import { useSession } from "@stores/user/selectors";
import toast from "react-hot-toast";
import { ICartItem } from "@models/cart/common.model";
import { useFavorites } from "@utils/hooks/useFavorites";
import Button from "@components/Atoms/Button";
import ButtonNoBackgroundVendorDetail from "../../Left/components/ButtonNoBackGroundVendorDetail";
import { cn } from "@utils/helpers/CN";

type ConceptProps = {
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
    servicePackage: IServicePackage;
    initialConceptId?: string;
};

export default function ConceptViewerPage({ isOpen, onOpenChange, servicePackage, initialConceptId }: ConceptProps) {
    // State for managing the booking popup
    const [isOpenBooking, setIsOpenBooking] = useState(false);

    // State for the currently selected concept and image
    const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // State for cart operations
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Hooks for user session and cart data
    const addToCart = useAddToCart();
    const session = useSession();
    const cart = useCart();
    const userId = session?.user?.id;
    const cartId = session?.user?.cartId;

    // Custom hook for managing favorite concepts
    const {
        isConceptInFavorites,
        toggleFavorite,
        isAddingToFavorite,
        isRemovingFromFavorite,
        isLoadingFavorites
    } = useFavorites();

    // Effect to set the initial concept when the dialog opens
    useEffect(() => {
        if (isOpen && initialConceptId && servicePackage?.serviceConcepts) {
            const conceptIndex = servicePackage.serviceConcepts.findIndex(concept => concept.id === initialConceptId);
            if (conceptIndex !== -1) {
                setSelectedConceptIndex(conceptIndex);
                setCurrentImageIndex(0); // Reset image index when concept changes
            }
        } else if (isOpen) {
            // Default to the first concept if no initial ID is provided
            setSelectedConceptIndex(0);
            setCurrentImageIndex(0);
        }
    }, [isOpen, initialConceptId, servicePackage?.serviceConcepts]);

    // Memoized values for the currently selected concept and its properties
    const selectedConceptObject = useMemo(() =>
        servicePackage?.serviceConcepts?.[selectedConceptIndex] as IServiceConcept | undefined,
        [servicePackage, selectedConceptIndex]
    );

    const isConceptInCart = useMemo(() =>
        cart?.data?.some((item: ICartItem) => item.serviceConceptId === selectedConceptObject?.id),
        [cart, selectedConceptObject]
    );

    const isCurrentConceptInFavorites = useMemo(() =>
        selectedConceptObject?.id ? isConceptInFavorites(selectedConceptObject.id) : false,
        [isConceptInFavorites, selectedConceptObject]
    );

    // Handlers for image navigation
    const handlePrevImage = () => {
        if (!selectedConceptObject) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? selectedConceptObject.images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        if (!selectedConceptObject) return;
        setCurrentImageIndex((prev) =>
            prev === selectedConceptObject.images.length - 1 ? 0 : prev + 1
        );
    };

    // Handler for selecting a concept
    const handleSelectConcept = (index: number) => {
        setSelectedConceptIndex(index);
        setCurrentImageIndex(0); // Reset to the first image of the new concept
    };

    // Handler for adding the selected concept to the cart
    const handleAddToCart = async () => {
        if (!userId) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
            return;
        }
        if (!cartId) {
            toast.error("Không tìm thấy giỏ hàng của bạn");
            return;
        }
        if (!selectedConceptObject?.id) {
            toast.error("Không tìm thấy thông tin concept");
            return;
        }
        if (isConceptInCart) {
            toast.error("Sản phẩm đã có trong giỏ hàng");
            return;
        }

        setIsAddingToCart(true);
        try {
            await addToCart(selectedConceptObject.id, cartId, userId);
            toast.success("Đã thêm vào giỏ hàng!");
        } catch (error: unknown) {
            console.error('Error in handleAddToCart:', error);
            toast.error("Lỗi: không thể thêm vào giỏ hàng");
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Handler for toggling the favorite status of a concept
    const handleToggleFavorite = async () => {
        if (!userId) {
            toast.error("Vui lòng đăng nhập để yêu thích sản phẩm");
            return;
        }
        if (selectedConceptObject) {
            await toggleFavorite(selectedConceptObject.id);
        }
    };

    const isFavoriteActionLoading = isAddingToFavorite || isRemovingFromFavorite || isLoadingFavorites;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 sm:p-6 m-0 w-full h-full max-h-full sm:max-w-full lg:max-w-6xl xl:max-w-7xl rounded-none sm:rounded-lg overflow-hidden flex flex-col">
                {/* DIALOG HEADER */}
                <DialogHeader className="flex flex-row justify-between items-center p-3 sm:p-4 border-b shrink-0">
                    <DialogTitle className="font-bold text-lg truncate pr-2">
                        {servicePackage?.name}
                    </DialogTitle>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-wait"
                            onClick={handleToggleFavorite}
                            disabled={isFavoriteActionLoading}
                            aria-label="Toggle Favorite"
                        >
                            {isFavoriteActionLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Heart size={20} className={cn("transition-all", isCurrentConceptInFavorites ? 'text-red-500 fill-current' : 'text-gray-600')} />
                            )}
                        </button>
                        <button onClick={() => onOpenChange?.(false)} className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
                            <X size={22} className="text-gray-600" />
                        </button>
                    </div>
                </DialogHeader>

                {/* MAIN CONTENT GRID */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
                    {/* LEFT COLUMN (Desktop only) - Concept List */}
                    <aside className="hidden lg:block lg:col-span-1 border-r overflow-y-auto p-4">
                        <h3 className="font-bold text-lg mb-4 sticky top-0 bg-white z-10 pb-3">Chọn Concept</h3>
                        <div className="space-y-3">
                            {servicePackage?.serviceConcepts?.map((concept, index) => (
                                <div
                                    key={concept.id || index}
                                    onClick={() => handleSelectConcept(index)}
                                    className={cn(
                                        "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2",
                                        selectedConceptIndex === index
                                            ? "bg-primary-opacity border-primary shadow-sm"
                                            : "bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-300"
                                    )}
                                >
                                    <img
                                        src={concept.images?.[0] || 'https://placehold.co/100x100/e2e8f0/a0aec0?text=N/A'}
                                        alt={concept.name}
                                        className="w-16 h-16 object-cover rounded-md mr-4 shrink-0"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm uppercase line-clamp-1">{concept.name}</span>
                                        <span className="text-sm text-gray-600">{Number(concept.price).toLocaleString('vi-VN')} VND</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* RIGHT COLUMN - Main Content Viewer */}
                    <main className="lg:col-span-2 overflow-y-auto pb-32 lg:pb-4">
                        <div className="p-0 sm:p-6">
                            {/* Image Gallery */}
                            <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg relative">
                                {servicePackage?.serviceConcepts[selectedConceptIndex]?.images?.length > 0 ? (
                                    <img
                                        src={servicePackage?.serviceConcepts[selectedConceptIndex]?.images[currentImageIndex]}
                                        alt="Concept image"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                )}
                                {/* Nút điều hướng */}
                                {servicePackage?.serviceConcepts[selectedConceptIndex]?.images?.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrevImage}
                                            className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        <div className="absolute bottom-4 right-4 bg-gray-700 text-white text-sm px-2 py-1 rounded-full">
                                            {currentImageIndex + 1}/{servicePackage?.serviceConcepts[selectedConceptIndex]?.images?.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Scroller */}
                            {selectedConceptObject?.images && selectedConceptObject?.images?.length > 1 && (
                                <div className="overflow-x-auto -mx-1 p-1">
                                    <div className="flex space-x-3 min-w-max">
                                        {selectedConceptObject.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={cn(
                                                    "w-20 h-20 object-cover rounded-lg cursor-pointer transition-all flex-shrink-0 border-2",
                                                    currentImageIndex === index ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CONCEPT SELECTOR (Mobile Only) */}
                            <div className="lg:hidden mt-6">
                                <h3 className="font-bold text-lg mb-3">Chọn Concept</h3>
                                <div className="overflow-x-auto -mx-1 p-1">
                                    <div className="flex space-x-3 min-w-max">
                                        {servicePackage?.serviceConcepts?.map((concept, index) => (
                                            <div
                                                key={concept.id || index}
                                                onClick={() => handleSelectConcept(index)}
                                                className={cn(
                                                    "flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-200 border-2 w-28 text-center",
                                                    selectedConceptIndex === index
                                                        ? "bg-primary-opacity border-primary"
                                                        : "bg-gray-50 border-transparent hover:bg-gray-100"
                                                )}
                                            >
                                                <img
                                                    src={concept.images?.[0] || 'https://placehold.co/100x100/e2e8f0/a0aec0?text=N/A'}
                                                    alt={concept.name}
                                                    className="w-16 h-16 object-cover rounded-md mb-2"
                                                />
                                                <span className="font-semibold text-xs uppercase line-clamp-2">{concept.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Concept Details */}
                            <div className="mt-6 border-t pt-6">
                                <h3 className="text-2xl font-bold uppercase text-gray-800">{selectedConceptObject?.name}</h3>
                                <div className="flex items-center mt-4">
                                    <span className="text-2xl font-extrabold text-primary">
                                        {Number(selectedConceptObject?.price || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </span>
                                </div>
                                <div
                                    className="prose prose-sm max-w-none text-gray-600 mt-4"
                                    dangerouslySetInnerHTML={{ __html: selectedConceptObject?.description || '<p>Không có mô tả chi tiết.</p>' }}
                                />
                                <div className="text-sm text-gray-500 mt-4 bg-gray-100 p-3 rounded-lg">
                                    <Info size={16} className="inline-block mr-2 -mt-1" />
                                    Đặt lịch trước 1 tuần để đảm bảo có thời gian chuẩn bị tốt nhất.
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="absolute bottom-0 left-0 right-0 lg:static bg-white/95 backdrop-blur-sm border-t p-3 lg:p-0 lg:bg-transparent lg:border-none">
                    <div className="flex flex-col sm:flex-row gap-3 lg:hidden">
                        <Button
                            className="w-full"
                            onClick={() => setIsOpenBooking(true)}
                        >
                            <Calendar size={18} className="mr-2" />Đặt lịch ngay
                        </Button>
                        <ButtonNoBackgroundVendorDetail
                            className="w-full"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || isConceptInCart}
                        >
                            {isAddingToCart ? <Loader2 size={18} className="animate-spin mr-2" /> : <ShoppingCart size={18} className="mr-2" />}
                            {isAddingToCart ? 'Đang thêm...' : isConceptInCart ? 'Đã có trong giỏ' : 'Thêm vào giỏ hàng'}
                        </ButtonNoBackgroundVendorDetail>
                    </div>
                    {/* Desktop buttons inside the main content area for better layout */}
                    <div className="hidden lg:flex lg:justify-end lg:items-center lg:p-6 lg:border-t">
                        <div className="flex gap-4">
                            <ButtonNoBackgroundVendorDetail
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || isConceptInCart}
                            >
                                {isAddingToCart ? <Loader2 size={18} className="animate-spin mr-2" /> : <ShoppingCart size={18} className="mr-2" />}
                                {isAddingToCart ? 'Đang thêm...' : isConceptInCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}
                            </ButtonNoBackgroundVendorDetail>
                            <Button onClick={() => setIsOpenBooking(true)} >
                                <Calendar size={18} className="mr-2" />Đặt lịch với concept này
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>

            {/* Booking Popup */}
            {selectedConceptObject && (
                <EnhancedBookingPopup
                    isOpen={isOpenBooking}
                    onClose={() => setIsOpenBooking(false)}
                    serviceConcept={selectedConceptObject}
                />
            )}
        </Dialog>
    );
}

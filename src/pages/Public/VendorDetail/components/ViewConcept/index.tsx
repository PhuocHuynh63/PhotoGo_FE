"use client";

import Button from "@components/Atoms/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Molecules/Dialog";
import { Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import ButtonNoBackgroundVendorDetail from "../../Left/components/ButtonNoBackGroundVendorDetail";
import { IServicePackage } from "@models/servicePackages/common.model";
import { IServiceConcept } from "@models/serviceConcepts/common.model";
import EnhancedBookingPopup from "../EnhancedBookingPopup";
import { useAddToCart, useCart } from "@stores/cart/selectors";
import { useSession } from "@stores/user/selectors";
import toast from "react-hot-toast";
import { ICartItem } from "@models/cart/common.model";

type ConceptProps = {
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
    servicePackage: IServicePackage;
    initialConceptId?: string;
};

export default function ConceptViewerPage({ isOpen, onOpenChange, servicePackage, initialConceptId }: ConceptProps) {
    const [activeTab, setActiveTab] = useState<string>("Hình ảnh");
    const addToCart = useAddToCart()
    const session = useSession()
    const cart = useCart()
    const userId = session?.user?.id
    const cartId = session?.user?.cartId
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    //#region handle action img
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedConcept, setSelectedConcept] = useState(0);

    useEffect(() => {
        if (initialConceptId && servicePackage?.serviceConcepts) {
            const conceptIndex = servicePackage.serviceConcepts.findIndex(concept => concept.id === initialConceptId);
            if (conceptIndex !== -1) {
                setSelectedConcept(conceptIndex);
                setCurrentImageIndex(0);
            }
        }
    }, [initialConceptId, servicePackage?.serviceConcepts]);

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? servicePackage.serviceConcepts[selectedConcept].images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === servicePackage.serviceConcepts[selectedConcept].images.length - 1 ? 0 : prev + 1
        );
    };
    //#endregion


    //#region
    const [isOpenBooking, setIsOpenBooking] = useState(false);
    const handleDialogBooking = () => {
        setIsOpenBooking(!isOpenBooking);
    }
    //#endregion


    //#region selectConcept
    const selectedConceptObject = servicePackage?.serviceConcepts[selectedConcept] as IServiceConcept;
    const isConceptInCart = cart?.data?.some((item: ICartItem) => item.serviceConceptId === selectedConceptObject?.id);
    //#endregion

    const handleAddToCart = async () => {
        try {
            if (!userId) {
                toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng")
                return
            }

            const conceptToAdd = servicePackage?.serviceConcepts[selectedConcept]
            if (!conceptToAdd?.id) {
                toast.error("Không tìm thấy thông tin concept")
                return
            }

            if (!cartId) {
                toast.error("Không tìm thấy giỏ hàng")
                return
            }

            if (isConceptInCart) {
                toast.error("Sản phẩm đã được thêm vào giỏ hàng")
                return
            }

            setIsAddingToCart(true)
            await addToCart(conceptToAdd.id, cartId, userId)
        } catch (error: unknown) {
            console.error('Error in handleAddToCart:', error)
            toast.error("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng")
        } finally {
            setIsAddingToCart(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTitle />
            <DialogContent className="xl:max-w-[1200px] max-h-[100vh] overflow-hidden">
                <DialogHeader className="font-bold text-xl border-b border-gray-200 pb-4 flex flex-row justify-between items-center">
                    <span>Xem Concept - {servicePackage?.name}</span>
                    <div className="flex space-x-2">
                        <button className="cursor-pointer p-2 rounded-full hover:bg-gray-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <button className="cursor-pointer p-2 rounded-full hover:bg-gray-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                        <button onClick={() => onOpenChange?.(false)} className="cursor-pointer p-2 rounded-full hover:bg-gray-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </DialogHeader>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 h-[calc(80vh-100px)]">
                    {/* Danh sách concept bên trái */}
                    <div className="lg:col-span-1 overflow-y-hidden hover:overflow-y-auto">
                        <h3 className="font-semibold text-lg mb-4 sticky top-0 bg-white z-10 pb-4 border-b-2">Chọn Concept</h3>
                        <div className="pr-2">
                            {servicePackage?.serviceConcepts?.map((concept, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSelectedConcept(index);
                                        setCurrentImageIndex(0);
                                    }}
                                    className={`flex border bg-gray-50 items-center p-3 rounded-lg mb-2 cursor-pointer transition-colors duration-200 ${selectedConcept === index ? "bg-primary-opacity border border-primary" : "hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3">
                                        {concept.images?.length > 0 && (
                                            <img
                                                src={concept.images[0]}
                                                alt="Concept thumbnail"
                                                className="w-12 h-12 object-cover rounded-md"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm uppercase line-clamp-1">{concept.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Khu vực hiển thị nội dung bên phải */}
                    <div className="lg:col-span-2 overflow-y-auto">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 mb-4 sticky top-0 bg-white z-10">
                            <button
                                onClick={() => setActiveTab("Hình ảnh")}
                                className={`cursor-pointer flex-1 py-3 text-center text-sm font-medium ${activeTab === "Hình ảnh" ? "border-b-2 border-primary text-primary" : "text-gray-500"
                                    }`}
                            >
                                Hình ảnh
                            </button>
                            <button
                                onClick={() => setActiveTab("Chi tiết")}
                                className={`cursor-pointer flex-1 py-3 text-center text-sm font-medium ${activeTab === "Chi tiết" ? "border-b-2 border-primary text-primary" : "text-gray-500"
                                    }`}
                            >
                                Chi tiết
                            </button>
                        </div>

                        {/* Nội dung tab */}
                        {activeTab === "Hình ảnh" ? (
                            <div className="relative">
                                {/* Khu vực hình ảnh */}
                                <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg relative">
                                    {servicePackage?.serviceConcepts[selectedConcept]?.images?.length > 0 ? (
                                        <img
                                            src={servicePackage?.serviceConcepts[selectedConcept]?.images[currentImageIndex]}
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
                                    {servicePackage?.serviceConcepts[selectedConcept]?.images?.length > 1 && (
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
                                                {currentImageIndex + 1}/{servicePackage?.serviceConcepts[selectedConcept]?.images?.length}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Hình ảnh thu nhỏ */}
                                <div className="overflow-x-auto mt-4">
                                    <div className="flex space-x-2 min-w-max pb-2">
                                        {servicePackage?.serviceConcepts[selectedConcept]?.images?.map((image: string, index: number) => (
                                            <div
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-20 h-20 bg-gray-200 rounded-md cursor-pointer flex-shrink-0 ${currentImageIndex === index ? "border-2 border-primary" : ""}`}
                                            >
                                                {image && (
                                                    <img
                                                        src={image}
                                                        alt={`Concept thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-700">
                                {/* Thông tin concept */}
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold uppercase">{servicePackage?.serviceConcepts[selectedConcept]?.name}</h3>
                                    <p>{servicePackage?.serviceConcepts[selectedConcept]?.description}</p>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm">{servicePackage?.serviceConcepts[selectedConcept]?.description}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{servicePackage?.serviceConcepts[selectedConcept]?.duration}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center mt-4">
                                        <span className="text-lg font-bold text-primary">
                                            {Number(servicePackage?.serviceConcepts[selectedConcept]?.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-4">Đặt cọc 50%</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Đặt lịch trước 1 tuần để đảm bảo có thời gian chuẩn bị tốt nhất.</p>

                                    <div className="flex gap-4">
                                        <Button className="mt-6" onClick={handleDialogBooking} ><Calendar size={18} />Đặt lịch với concept này</Button>
                                        <ButtonNoBackgroundVendorDetail
                                            className="mt-6"
                                            onClick={handleAddToCart}
                                            disabled={isAddingToCart || isConceptInCart}
                                        >
                                            {isAddingToCart ? <><Loader2 size={18} className="animate-spin" /> đang thêm sản phẩm</> : isConceptInCart ? 'Sản phẩm đã được thêm vào giỏ hàng' : 'Thêm concept vào giỏ hàng'}
                                        </ButtonNoBackgroundVendorDetail>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </DialogContent>
            {/* <Booking isOpen={isOpenBooking} onOpenChange={handleDialogBooking} concept={selectedConceptObject} /> */}
            <EnhancedBookingPopup isOpen={isOpenBooking} onClose={handleDialogBooking} />
        </Dialog>
    );
}
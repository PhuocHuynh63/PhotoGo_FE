"use client";

import Button from "@components/Atoms/Button";
import ButtonNoBackground from "@components/Atoms/ButtonNoBackground";
import { Dialog, DialogContent, DialogHeader } from "@components/Molecules/Dialog";
import { Calendar } from "lucide-react";
import { useState } from "react";
import ButtonNoBackgroundVendorDetail from "../../Left/components/ButtonNoBackGroundVendorDetail";

type ConceptProps = {
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
};

export default function ConceptViewerPage({ isOpen, onOpenChange }: ConceptProps) {
    const [activeTab, setActiveTab] = useState("Hình ảnh");
    const [selectedConcept, setSelectedConcept] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const selectConcept = [
        {
            id: 1,
            name: "ALBUM STUDIO HÀN QUỐC CAO CẤP",
            description: "Studio & Biệt thự cổ điển",
            price: "10.000.000đ",
            duration: "2 giờ",
            images: ["https://tonywedding.vn/wp-content/uploads/2023/02/3115e9feb64b094cb2e0049bc7e86fee-scaled.jpg", "https://tonywedding.vn/wp-content/uploads/2024/12/462142930_960299022805312_2040105690201559005_n.jpg", "https://file.hstatic.net/200000054678/file/kinh-nghiem-chup-anh-cuoi-trong-studio-1_fdd65cab8f084f669456507cd26b240b.jpg", "https://tonywedding.vn/wp-content/uploads/2023/06/IMG_3506-scaled.jpg"],
            detailedDescription: "Concept chụp ảnh cưới với phong cách cổ điển sang trọng, tông màu ấm áp. Ảnh sẽ được thực hiện trong không gian sang trọng với ánh sáng tự nhiên và sự tinh tế.",
        },
        {
            id: 2,
            name: "Ngoại cảnh Đà Lạt",
            description: "Bãi biển Vũng Tàu",
            price: "15.000.000đ",
            duration: "3 giờ",
            images: ["https://tonywedding.vn/wp-content/uploads/2023/11/z4856859455985_215fe12df0744aa03fd35e5139964219.jpg", "https://tonywedding.vn/wp-content/uploads/2024/07/7-1.png"],
            detailedDescription: "Concept chụp ảnh cưới tại bãi biển Vũng Tàu, với phong cách lãng mạn và tự nhiên. Tông màu xanh biển và ánh nắng tự nhiên sẽ làm nổi bật tình yêu của bạn.",
        },
        {
            id: 3,
            name: "Ngoại cảnh Sài Gòn",
            description: "Trung tâm TP. Hồ Chí Minh",
            price: "20.000.000đ",
            duration: "4 giờ",
            images: ["https://tonywedding.vn/wp-content/uploads/2024/10/467776601_997349659100248_2231391539684830285_n.jpg"],
            detailedDescription: "Concept chụp ảnh cưới hiện đại tại trung tâm TP. Hồ Chí Minh, với phong cách năng động và thời thượng. Ảnh sẽ được chụp tại các địa điểm nổi bật trong thành phố.",
        },
    ];

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? selectConcept[selectedConcept].images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === selectConcept[selectedConcept].images.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="xl:max-w-[1200px] max-h-[100vh] overflow-hidden">
                <DialogHeader className="font-bold text-xl border-b border-gray-200 pb-4 flex flex-row justify-between items-center">
                    <span>Xem Concept - Tony Wedding</span>
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
                            {selectConcept.map((concept, index) => (
                                <div
                                    key={concept.id}
                                    onClick={() => {
                                        setSelectedConcept(index);
                                        setCurrentImageIndex(0);
                                    }}
                                    className={`flex border bg-gray-50 items-center p-3 rounded-lg mb-2 cursor-pointer transition-colors duration-200 ${selectedConcept === index ? "bg-primary-opacity border border-primary" : "hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3">
                                        {concept.images.length > 0 && (
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
                                    {selectConcept[selectedConcept].images.length > 0 ? (
                                        <img
                                            src={selectConcept[selectedConcept].images[currentImageIndex]}
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
                                    {selectConcept[selectedConcept].images.length > 1 && (
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
                                                {currentImageIndex + 1}/{selectConcept[selectedConcept].images.length}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Hình ảnh thu nhỏ */}
                                <div className="flex space-x-2 mt-4">
                                    {selectConcept[selectedConcept].images.map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-16 h-16 bg-gray-200 rounded-md cursor-pointer ${currentImageIndex === index ? "border-2 border-primary" : ""
                                                }`}
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
                        ) : (
                            <div className="text-gray-700">
                                {/* Thông tin concept */}
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold uppercase">{selectConcept[selectedConcept].name}</h3>
                                    <p>{selectConcept[selectedConcept].detailedDescription}</p>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm">{selectConcept[selectedConcept].description}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">{selectConcept[selectedConcept].duration}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center mt-4">
                                        <span className="text-lg font-bold text-primary">{selectConcept[selectedConcept].price}</span>
                                        <span className="text-sm text-gray-500 ml-4">Đặt cọc 50%</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Đặt lịch trước 1 tuần để đảm bảo có thời gian chuẩn bị tốt nhất.</p>

                                    <div className="flex gap-4">
                                        <Button className="mt-6"><Calendar size={18} />Đặt lịch với concept này</Button>
                                        <ButtonNoBackgroundVendorDetail className="mt-6">Thêm concept vào giỏ hàng</ButtonNoBackgroundVendorDetail>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
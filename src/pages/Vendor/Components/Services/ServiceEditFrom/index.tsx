"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Atoms/ui/button";
import { Input } from "@/components/Atoms/ui/input";
import { Label } from "@/components/Atoms/ui/label";
import TipTapEditor from "@/components/Organisms/TipTapEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Atoms/ui/accordion";
import { ImageIcon, Pencil, Trash, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@components/Atoms/ui/badge";
import { ROUTES } from "@routes";
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat";
import packageService from "@services/packageServices";
import { IServicePackageResponse } from "@models/servicePackages/response.model";
import { useDropzone } from "react-dropzone";
import ServicePackageSaveButton from "./ServicePackageSaveButton";
import ServiceConceptSaveButton from "./ServiceConceptSaveButton";

interface ServiceType {
    id: string;
    name: string;
    description: string;
}

interface ServiceConceptImage {
    id: string;
    serviceConceptId: string;
    imageUrl: string;
    createdAt: string;
}

interface ServiceConcept {
    id: string;
    name: string;
    description: string;
    price: number;
    finalPrice: number;
    duration: number;
    serviceTypes?: { id: string }[];
    serviceConceptServiceTypes?: { serviceTypeId: string; serviceType?: ServiceType }[];
    images?: ServiceConceptImage[];
}

interface ConceptFormData {
    id: string;
    name: string;
    description: string;
    price: number;
    finalPrice: number;
    duration: number;
    serviceTypeIds: string[];
    images: File[];
}

interface ServiceEditFormProps {
    initialService: {
        id: string;
        name: string;
        description: string;
        status: string;
        image?: string;
        serviceConcepts: ServiceConcept[];
    };
    serviceTypes: ServiceType[];
}

export default function ServiceEditForm({ initialService, serviceTypes }: ServiceEditFormProps) {
    const router = useRouter();
    const [serviceData, setServiceData] = useState({
        name: initialService?.name,
        description: initialService?.description,
        status: initialService?.status as "hoạt động" | "không hoạt động",
        image: undefined as File | undefined,
        imagePreview: initialService?.image || "",
    });
    const [concepts, setConcepts] = useState<ConceptFormData[]>(() => {
        if (!initialService?.serviceConcepts || initialService.serviceConcepts.length === 0) {
            // Nếu không có service concepts, tạo một concept mặc định
            return [{
                id: "",
                name: "",
                description: "",
                price: 0,
                finalPrice: 0,
                duration: 60,
                serviceTypeIds: [],
                images: [],
            }];
        }

        return initialService.serviceConcepts.map((c) => {
            return {
                id: c.id || "",
                name: c.name || "",
                description: c.description || "",
                price: Number(c.price) || 0,
                finalPrice: Number(c.finalPrice) || 0,
                duration: Number(c.duration) || 60,
                serviceTypeIds:
                    (c.serviceConceptServiceTypes?.map((t) => t.serviceTypeId) || [])
                        .concat(c.serviceTypes?.map((t) => t.id) || []),
                images: [],
            };
        });
    });
    const [conceptImagePreviews, setConceptImagePreviews] = useState<string[][]>(() => {
        if (!initialService?.serviceConcepts || initialService.serviceConcepts.length === 0) {
            // Nếu không có service concepts, tạo một mảng rỗng cho image previews
            return [[]];
        }

        return initialService.serviceConcepts.map((c) => c.images?.map(img => img.imageUrl) || []);
    });
    const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Lưu giá gốc từ DB để so sánh
    const [originalPrices, setOriginalPrices] = useState<number[]>(() => {
        if (!initialService?.serviceConcepts || initialService.serviceConcepts.length === 0) {
            return [0];
        }
        return initialService.serviceConcepts.map((c) => Number(c.price) || 0);
    });

    // Dropzone for service image
    const serviceImageDropzone = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setServiceData((prev) => ({ ...prev, image: file }));
                const reader = new FileReader();
                reader.onload = () => setServiceData((prev) => ({ ...prev, image: file, imagePreview: reader.result as string }));
                reader.readAsDataURL(file);
            }
        },
        onDropRejected: () => {
            toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)");
        }
    });

    // Dropzone for concept images
    const conceptImageDropzone = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        maxFiles: 10,
        onDrop: (acceptedFiles) => {
            const currentConcept = concepts[currentConceptIndex];
            if (!currentConcept) {
                toast.error("Không tìm thấy gói dịch vụ");
                return;
            }

            const remainingSlots = 10 - currentConcept.images.length;
            const filesToAdd = acceptedFiles.slice(0, remainingSlots);

            if (acceptedFiles.length > remainingSlots) {
                toast.error(`Chỉ có thể thêm ${remainingSlots} ảnh nữa (tối đa 10 ảnh)`);
            }

            const newImages = [...currentConcept.images, ...filesToAdd];
            setConcepts((prev) => {
                const newConcepts = [...prev];
                newConcepts[currentConceptIndex] = { ...newConcepts[currentConceptIndex], images: newImages };
                return newConcepts;
            });

            filesToAdd.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () =>
                    setConceptImagePreviews((prev) => {
                        const newPreviews = [...prev];
                        newPreviews[currentConceptIndex] = [...(newPreviews[currentConceptIndex] || []), reader.result as string];
                        return newPreviews;
                    });
                reader.readAsDataURL(file);
            });
        },
        onDropRejected: () => {
            toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)");
        }
    });

    useEffect(() => {
        if (concepts.length > 0 && currentConceptIndex >= concepts.length) {
            setCurrentConceptIndex(Math.max(0, concepts.length - 1));
        }
    }, [concepts.length, currentConceptIndex]);

    const removeConceptImage = (conceptIndex: number, imageIndex: number) => {
        const currentConcept = concepts[conceptIndex];

        if (!currentConcept) {
            toast.error("Không tìm thấy gói dịch vụ");
            return;
        }

        setConcepts((prev) => {
            const newConcepts = [...prev];
            newConcepts[conceptIndex] = {
                ...newConcepts[conceptIndex],
                images: newConcepts[conceptIndex].images.filter((_, i) => i !== imageIndex),
            };
            return newConcepts;
        });
        setConceptImagePreviews((prev) => {
            const newPreviews = [...prev];
            newPreviews[conceptIndex] = newPreviews[conceptIndex].filter((_, i) => i !== imageIndex);
            return newPreviews;
        });
    };

    const handleAddConcept = () => {
        setConcepts((prev) => [
            ...prev,
            { id: "", name: "", description: "", price: 0, finalPrice: 0, duration: 60, serviceTypeIds: [], images: [] },
        ]);
        setConceptImagePreviews((prev) => [...prev, []]);
        setOriginalPrices((prev) => [...prev, 0]);
        setCurrentConceptIndex(concepts.length);
    };

    const handleRemoveConcept = async (index: number) => {
        if (concepts.length > 1) {
            const conceptToRemove = concepts[index];
            if (conceptToRemove.id) {
                setIsLoading(true);
                try {
                    const response = await packageService.deleteServiceConcept(conceptToRemove.id) as IServicePackageResponse;
                    if (response.statusCode === 200) {
                        toast.success("Xóa gói dịch vụ thành công!");
                    } else {
                        toast.error(response.error || "Có lỗi xảy ra khi xóa gói dịch vụ!");
                        setIsLoading(false);
                        return;
                    }
                } catch (error: unknown) {
                    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
                        toast.error((error.response.data as { message: string }).message);
                    } else {
                        toast.error((error as { message: string }).message || "Có lỗi xảy ra khi xóa gói dịch vụ!");
                    }
                    setIsLoading(false);
                    return;
                }
                setIsLoading(false);
            }
            setConcepts((prev) => prev.filter((_, i) => i !== index));
            setConceptImagePreviews((prev) => prev.filter((_, i) => i !== index));
            setOriginalPrices((prev) => prev.filter((_, i) => i !== index));
            setCurrentConceptIndex(Math.max(0, index - 1));
        } else {
            // Nếu chỉ còn 1 concept, reset về trạng thái mặc định thay vì xóa
            setConcepts([{
                id: "",
                name: "",
                description: "",
                price: 0,
                finalPrice: 0,
                duration: 60,
                serviceTypeIds: [],
                images: [],
            }]);
            setConceptImagePreviews([[]]);
            setOriginalPrices([0]);
            setCurrentConceptIndex(0);
            toast.success("Đã reset gói dịch vụ về trạng thái mặc định");
        }
    };

    const handleConceptChange = (index: number, field: string, value: unknown) => {
        if (index < 0 || index >= concepts.length) {
            toast.error("Chỉ mục gói dịch vụ không hợp lệ");
            return;
        }

        setConcepts((prev) => {
            const newConcepts = [...prev];
            newConcepts[index] = { ...newConcepts[index], [field]: value };
            return newConcepts;
        });
    };

    const handleServiceTypeToggle = (typeId: string, conceptIndex: number) => {
        if (conceptIndex < 0 || conceptIndex >= concepts.length) {
            toast.error("Chỉ mục gói dịch vụ không hợp lệ");
            return;
        }

        setConcepts((prev) => {
            const newConcepts = [...prev];
            newConcepts[conceptIndex] = {
                ...newConcepts[conceptIndex],
                serviceTypeIds: (newConcepts[conceptIndex].serviceTypeIds || []).includes(typeId)
                    ? (newConcepts[conceptIndex].serviceTypeIds || []).filter((id) => id !== typeId)
                    : [...(newConcepts[conceptIndex].serviceTypeIds || []), typeId],
            };
            return newConcepts;
        });
    };

    const handleDeleteService = async () => {
        setIsLoading(true);
        const response = await packageService.deletePackage(initialService?.id || "") as IServicePackageResponse;
        if (response.statusCode === 200) {
            setIsLoading(false);
            toast.success("Xóa dịch vụ thành công")
            router.push(ROUTES.VENDOR.SERVICE_PACKAGES.LIST)
        } else {
            toast.error("Có lỗi xảy ra khi xóa dịch vụ")
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Pencil className="h-4 w-4" />
                                Chỉnh sửa dịch vụ: <span className="text-primary">{serviceData?.name}</span>
                            </div>

                            <Button variant="destructive" size="icon" onClick={() => handleDeleteService()} disabled={isLoading} className="cursor-pointer">
                                <Trash className="h-4 w-4 text-white" />
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <div className="space-y-4 p-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xl font-semibold text-gray-900">
                            📝 Tên dịch vụ <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={serviceData?.name}
                            onChange={(e) => setServiceData((prev) => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-xl font-semibold text-gray-900">
                            📄 Mô tả dịch vụ <span className="text-red-500">*</span>
                        </Label>
                        <TipTapEditor
                            value={serviceData?.description}
                            onChange={(value) => setServiceData((prev) => ({ ...prev, description: value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-xl font-semibold text-gray-900">
                            🚦 Trạng thái
                        </Label>
                        <Select
                            value={serviceData?.status}
                            onValueChange={(value: "hoạt động" | "không hoạt động") =>
                                setServiceData((prev) => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger className="border-2 focus:border-blue-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hoạt động" className="text-green-700">
                                    ✅ Hoạt động
                                </SelectItem>
                                <SelectItem value="không hoạt động" className="text-red-700">
                                    ⏸️ Tạm dừng
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xl font-semibold text-gray-900">
                            📸 Ảnh đại diện dịch vụ
                        </Label>
                        <div
                            {...serviceImageDropzone.getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${serviceImageDropzone.isDragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            {serviceData?.imagePreview ? (
                                <div className="relative flex justify-center items-center">
                                    <Image
                                        src={serviceData?.imagePreview || "/placeholder.svg"}
                                        alt="Preview"
                                        width={600}
                                        height={192}
                                        className="w-64 h-64 object-cover rounded-lg"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-0 right-0 h-8 w-8 p-0 text-white bg-red-500 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setServiceData((prev) => ({ ...prev, image: undefined, imagePreview: "" }));
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-900">
                                            {serviceImageDropzone.isDragActive
                                                ? "Thả ảnh vào đây..."
                                                : "Kéo thả ảnh vào đây hoặc click để chọn"
                                            }
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Chấp nhận: JPEG, PNG, GIF, WebP
                                        </p>
                                    </div>
                                    <input {...serviceImageDropzone.getInputProps()} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nút lưu riêng cho Service Package */}
                    <div className="flex justify-end p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-yellow-800">
                                <span className="text-lg">💾</span>
                                <span className="text-sm font-medium">Lưu thông tin dịch vụ chính</span>
                            </div>
                            <ServicePackageSaveButton
                                serviceId={initialService?.id}
                                serviceData={serviceData}
                                onSuccess={() => {
                                    router.refresh();
                                    router.push(ROUTES.VENDOR.SERVICE_PACKAGES.VIEW.replace(':id', initialService?.id || ""));
                                }}
                            />
                        </div>
                    </div>

                    <div className='border-b border-gray-200'></div>

                    <div className="flex justify-between items-center p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-blue-900">
                                📦 Gói dịch vụ {currentConceptIndex + 1}/{concepts?.length}
                            </h1>
                            <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                                {concepts[currentConceptIndex]?.id ? "Chỉnh sửa" : "Tạo mới"}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleAddConcept}
                            className="gap-2 cursor-pointer border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                        >
                            ➕ Thêm gói dịch vụ
                        </Button>
                    </div>

                    {concepts && concepts.length > 0 && concepts[currentConceptIndex] && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="concept-name" className="text-xl font-semibold text-gray-900">
                                    🏷️ Tên gói dịch vụ <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="concept-name"
                                    value={concepts[currentConceptIndex]?.name || ""}
                                    onChange={(e) => handleConceptChange(currentConceptIndex, "name", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="concept-description" className="text-xl font-semibold text-gray-900">
                                    📋 Mô tả gói dịch vụ <span className="text-red-500">*</span>
                                </Label>
                                <TipTapEditor
                                    value={concepts[currentConceptIndex]?.description || ""}
                                    onChange={(value) => handleConceptChange(currentConceptIndex, "description", value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="concept-price" className="text-xl font-semibold text-gray-900">
                                        💰 Giá (VNĐ) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="concept-price"
                                        type="number"
                                        value={concepts[currentConceptIndex]?.price || 0}
                                        onChange={(e) => {
                                            handleConceptChange(currentConceptIndex, "price", Number(e.target.value));
                                        }}
                                        required
                                    />
                                    {concepts[currentConceptIndex]?.price > 0 && (
                                        <div className="flex flex-col items-start gap-2">
                                            <p className="text-sm text-gray-500">
                                                <span className="font-bold">
                                                    {concepts[currentConceptIndex]?.price === originalPrices[currentConceptIndex]
                                                        ? formatPrice(concepts[currentConceptIndex]?.price || 0)
                                                        : formatPrice(
                                                            concepts[currentConceptIndex]?.price +
                                                            concepts[currentConceptIndex]?.price * 0.05 +
                                                            concepts[currentConceptIndex]?.price * 0.3
                                                        )
                                                    }
                                                </span>
                                                {concepts[currentConceptIndex]?.price === originalPrices[currentConceptIndex]
                                                    ? " (Giá đã bao gồm VAT và hoa hồng, lấy từ dữ liệu gốc)"
                                                    : ` = ${formatPrice(concepts[currentConceptIndex]?.price)} + ${formatPrice(concepts[currentConceptIndex]?.price * 0.05)} (VAT 5%) + ${formatPrice(concepts[currentConceptIndex]?.price * 0.3)} (Hoa hồng 30%)`
                                                }
                                            </p>
                                            <p className="text-sm text-gray-500">*Giá trên đã bao gồm thuế 5% VAT và 30% hoa hồng</p>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="concept-duration" className="text-xl font-semibold text-gray-900">
                                        ⏱️ Thời gian (phút) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="concept-duration"
                                        type="number"
                                        value={concepts[currentConceptIndex]?.duration || 60}
                                        onChange={(e) => handleConceptChange(currentConceptIndex, "duration", Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Accordion type="single" collapsible >
                                    <AccordionItem value="service-types">
                                        <AccordionTrigger className="cursor-pointer">
                                            <span className="text-xl font-semibold text-gray-900">
                                                🎯 Loại dịch vụ <span className="text-red-500">*</span>
                                                <span className="text-sm font-medium text-gray-600 ml-2">
                                                    {(concepts[currentConceptIndex]?.serviceTypeIds || []).length > 0
                                                        ? `(đã chọn ${(concepts[currentConceptIndex]?.serviceTypeIds || []).length})`
                                                        : "(Chưa chọn)"}
                                                </span>
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-2 gap-2">
                                                {serviceTypes?.map((type) => (
                                                    <Card
                                                        key={type?.id}
                                                        className={`cursor-pointer transition-colors border-2 ${(concepts[currentConceptIndex]?.serviceTypeIds || []).includes(type?.id)
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "hover:border-gray-300"
                                                            }`}
                                                        onClick={() => handleServiceTypeToggle(type?.id, currentConceptIndex)}
                                                    >
                                                        <CardContent className="p-3">
                                                            <div className="flex items-center justify-between mt-6">
                                                                <div>
                                                                    <p className="font-medium text-sm">{type.name}</p>
                                                                    <p className="text-xs text-gray-500">{type.description}</p>
                                                                </div>
                                                                {(concepts[currentConceptIndex]?.serviceTypeIds || []).includes(type?.id) && (
                                                                    <Badge className="bg-blue-100 text-blue-800" variant={"outline"}>✓</Badge>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Đã chọn: {(concepts[currentConceptIndex]?.serviceTypeIds || []).length} loại dịch vụ
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xl font-semibold text-gray-900">
                                    🖼️ Ảnh gói dịch vụ <span className="text-sm text-gray-600">(tối đa 10 ảnh)</span>
                                </Label>
                                {conceptImagePreviews[currentConceptIndex]?.length > 0 && (
                                    <div className="grid grid-cols-5 gap-10 my-4">
                                        {conceptImagePreviews[currentConceptIndex].map((preview, index) => (
                                            <div key={index} className="relative w-60 h-60">
                                                <Image
                                                    src={preview || "/placeholder.svg"}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className=" object-cover rounded-lg"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-1 right-1 h-8 w-8 p-0 text-white bg-red-500 cursor-pointer"
                                                    onClick={() => removeConceptImage(currentConceptIndex, index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {conceptImagePreviews[currentConceptIndex]?.length < 10 && (
                                    <div
                                        {...conceptImageDropzone.getRootProps()}
                                        className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${conceptImageDropzone.isDragActive
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                            <div className="mt-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {conceptImageDropzone.isDragActive
                                                        ? "Thả ảnh vào đây..."
                                                        : `Thêm ảnh (${conceptImagePreviews[currentConceptIndex]?.length || 0}/10)`
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Kéo thả hoặc click để chọn - Chấp nhận: JPEG, PNG, GIF, WebP
                                                </p>
                                            </div>
                                            <input {...conceptImageDropzone.getInputProps()} />
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                    {/* Nhóm nút điều hướng và thao tác concept */}
                    {concepts && concepts.length > 0 && (
                        <div className="flex justify-between items-center mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentConceptIndex((prev) => Math.max(0, prev - 1))}
                                    disabled={currentConceptIndex === 0}
                                    className="cursor-pointer border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    ⬅️ Gói trước
                                </Button>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-green-800 bg-green-100 px-3 py-1 rounded-full">
                                        📍 Gói {currentConceptIndex + 1} / {concepts.length}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentConceptIndex((prev) => Math.min(concepts.length - 1, prev + 1))}
                                    disabled={currentConceptIndex === concepts.length - 1}
                                    className="cursor-pointer border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Gói tiếp theo ➡️
                                </Button>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={async () => await handleRemoveConcept(currentConceptIndex)}
                                    className="cursor-pointer text-red-600 border-red-300 hover:bg-red-50 font-medium"
                                >
                                    🗑️ {concepts.length <= 1 ? "Đặt lại gói này" : "Xóa gói này"}
                                </Button>

                                <div className="relative">
                                    <ServiceConceptSaveButton
                                        conceptData={concepts[currentConceptIndex]}
                                        originalPrice={originalPrices[currentConceptIndex]}
                                        servicePackageId={initialService?.id}
                                        onSuccess={() => {
                                            router.refresh();
                                        }}
                                    />
                                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Nút hủy ở cuối */}
                    <div className="mt-6 flex justify-end gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">❌ Không lưu thay đổi</span>
                            <Button
                                variant="outline"
                                onClick={() => router.push(ROUTES.VENDOR.SERVICE_PACKAGES.VIEW.replace(':id', initialService?.id || ""))}
                                className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Hủy bỏ
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
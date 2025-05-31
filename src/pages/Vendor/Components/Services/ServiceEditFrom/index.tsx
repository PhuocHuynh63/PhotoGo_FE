"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Atoms/ui/button";
import { Input } from "@/components/Atoms/ui/input";
import { Label } from "@/components/Atoms/ui/label";
import { Textarea } from "@/components/Atoms/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card";
import { ImageIcon, Pencil, Trash, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@components/Atoms/ui/badge";
import { ROUTES } from "@routes";
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat";
import packageService from "@services/packageServices";
import { IBackendResponse } from "@models/backend/backendResponse.model";

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
    duration: number;
    serviceTypes?: { id: string }[];
    images?: ServiceConceptImage[];
}

interface ConceptFormData {
    id: string;
    name: string;
    description: string;
    price: number;
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
    // console.log('Initial Service:', initialService);
    // console.log('Service Types:', serviceTypes);

    const [serviceData, setServiceData] = useState({
        name: initialService?.name,
        description: initialService?.description,
        status: initialService?.status as "hoạt động" | "không hoạt động",
        image: undefined as File | undefined,
        imagePreview: initialService?.image || "",
    });
    const [concepts, setConcepts] = useState<ConceptFormData[]>(initialService?.serviceConcepts?.map((c) => {
        console.log('Concept serviceTypes:', c.serviceTypes);
        return {
            id: c.id || "",
            name: c.name || "",
            description: c.description || "",
            price: c.price || 0,
            duration: c.duration || 60,
            serviceTypeIds: c.serviceTypes?.map((t) => t.id) || [],
            images: [],
        };
    }) || []);
    const [conceptImagePreviews, setConceptImagePreviews] = useState<string[][]>(
        initialService?.serviceConcepts?.map((c) => c.images?.map(img => img.imageUrl) || []) || []
    );
    const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    // useEffect(() => {
    //     const validate = () => {
    //         if (!serviceData.name || !serviceData.description) {
    //             toast.error("Vui lòng điền đầy đủ thông tin dịch vụ");
    //             return false;
    //         }
    //         const invalidConcepts = concepts.filter(
    //             (c) => !c.name || !c.description || c.price <= 0 || c.serviceTypeIds.length === 0
    //         );
    //         if (invalidConcepts.length > 0) {
    //             toast.error("Vui lòng điền đầy đủ thông tin cho tất cả các gói dịch vụ");
    //             return false;
    //         }
    //         return true;
    //     };

    //     // Thêm validation realtime
    //     const timer = setTimeout(() => {
    //         validate();
    //     }, 500);
    //     return () => clearTimeout(timer);
    // }, [serviceData, concepts]);

    const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setServiceData((prev) => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onload = () => setServiceData((prev) => ({ ...prev, image: file, imagePreview: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const handleConceptImagesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const files = Array.from(e.target.files || []);
        const remainingSlots = 10 - concepts[index].images.length;
        const filesToAdd = files.slice(0, remainingSlots);

        if (files.length > remainingSlots) {
            toast.error(`Chỉ có thể thêm ${remainingSlots} ảnh nữa (tối đa 10 ảnh)`);
        }

        const newImages = [...concepts[index].images, ...filesToAdd];
        setConcepts((prev) => {
            const newConcepts = [...prev];
            newConcepts[index] = { ...newConcepts[index], images: newImages };
            return newConcepts;
        });

        filesToAdd.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () =>
                setConceptImagePreviews((prev) => {
                    const newPreviews = [...prev];
                    newPreviews[index] = [...(newPreviews[index] || []), reader.result as string];
                    return newPreviews;
                });
            reader.readAsDataURL(file);
        });
    };

    const removeConceptImage = (conceptIndex: number, imageIndex: number) => {
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
            { id: "", name: "", description: "", price: 0, duration: 60, serviceTypeIds: [], images: [] },
        ]);
        setConceptImagePreviews((prev) => [...prev, []]);
        setCurrentConceptIndex(concepts.length);
    };

    const handleRemoveConcept = (index: number) => {
        if (concepts.length > 1) {
            setConcepts((prev) => prev.filter((_, i) => i !== index));
            setConceptImagePreviews((prev) => prev.filter((_, i) => i !== index));
            setCurrentConceptIndex(Math.max(0, index - 1));
        }
    };

    const handleConceptChange = (index: number, field: string, value: unknown) => {
        setConcepts((prev) => {
            const newConcepts = [...prev];
            newConcepts[index] = { ...newConcepts[index], [field]: value };
            return newConcepts;
        });
    };

    const handleServiceTypeToggle = (typeId: string, conceptIndex: number) => {
        setConcepts((prev) => {
            const newConcepts = [...prev];
            newConcepts[conceptIndex] = {
                ...newConcepts[conceptIndex],
                serviceTypeIds: newConcepts[conceptIndex].serviceTypeIds.includes(typeId)
                    ? newConcepts[conceptIndex].serviceTypeIds.filter((id) => id !== typeId)
                    : [...newConcepts[conceptIndex].serviceTypeIds, typeId],
            };
            return newConcepts;
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Tạo FormData cho dịch vụ
            const serviceFormData = new FormData();
            serviceFormData.append("name", serviceData?.name || "");
            serviceFormData.append("description", serviceData?.description || "");
            serviceFormData.append("status", serviceData?.status || "hoạt động");
            if (serviceData?.image) {
                serviceFormData.append("image", serviceData.image);
            }

            // Gọi API cập nhật dịch vụ
            const response = await packageService.updatePackage(initialService?.id || "", serviceFormData) as IBackendResponse<any>;
            if (response.statusCode === 200) {
                toast.success("Cập nhật dịch vụ thành công!")

                // Xử lý từng concept
                for (const concept of concepts) {
                    const conceptFormData = new FormData();
                    conceptFormData.append('name', concept?.name);
                    conceptFormData.append('description', concept?.description);
                    conceptFormData.append('price', concept?.price.toString());
                    conceptFormData.append('duration', concept?.duration.toString());
                    conceptFormData.append('servicePackageId', initialService?.id || "");
                    conceptFormData.append('serviceTypeIds', concept?.serviceTypeIds.join(", "));
                    conceptFormData.append('status', "hoạt động");
                    concept?.images.forEach((image, idx) => {
                        if (idx < 10) conceptFormData.append('images', image);
                    });

                    let responseConcept;
                    if (concept?.id) {
                        // Nếu có ID thì cập nhật concept hiện có
                        responseConcept = await packageService.updateServiceConcept(concept?.id, conceptFormData) as IBackendResponse<any>
                    } else {
                        // Nếu không có ID thì tạo mới concept
                        responseConcept = await packageService.createServiceConcept(conceptFormData) as IBackendResponse<any>
                    }

                    if (responseConcept.statusCode !== 200 && responseConcept.statusCode !== 201) {
                        toast.error(responseConcept.error || "Có lỗi xảy ra khi xử lý gói dịch vụ")
                        return;
                    }
                }

                toast.success("Cập nhật gói dịch vụ thành công");
                router.refresh();
                router.push(ROUTES.VENDOR.SERVICE_PACKAGES.VIEW.replace(':id', initialService?.id || ""));
            } else {
                toast.error(response.error || "Có lỗi xảy ra khi cập nhật dịch vụ")
            }
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
                toast.error((error.response.data as { message: string }).message);
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật dịch vụ");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteService = async () => {
        setIsLoading(true);
        const response = await packageService.deletePackage(initialService?.id || "") as IBackendResponse<any>;
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

                            <Button variant="destructive" size="icon" onClick={() => handleDeleteService()} disabled={isLoading}>
                                <Trash className="h-4 w-4 text-white" />
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <div className="space-y-4 p-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên dịch vụ *</Label>
                        <Input
                            id="name"
                            value={serviceData?.name}
                            onChange={(e) => setServiceData((prev) => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả dịch vụ *</Label>
                        <Textarea
                            id="description"
                            value={serviceData?.description}
                            onChange={(e) => setServiceData((prev) => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select
                            value={serviceData?.status}
                            onValueChange={(value: "hoạt động" | "không hoạt động") =>
                                setServiceData((prev) => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hoạt động">Hoạt động</SelectItem>
                                <SelectItem value="không hoạt động">Tạm dừng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Ảnh đại diện dịch vụ</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                                        className="absolute top-0 right-0 h-8 w-8 p-0 text-white bg-red-500"
                                        onClick={() =>
                                            setServiceData((prev) => ({ ...prev, image: undefined, imagePreview: "" }))
                                        }
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <label htmlFor="service-image" className="cursor-pointer">
                                        <span className="mt-2 block text-sm font-medium text-gray-900">Tải lên ảnh</span>
                                        <input
                                            id="service-image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleServiceImageChange}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                            Gói dịch vụ {currentConceptIndex + 1}/{concepts?.length}
                        </h3>
                        <Button variant="outline" onClick={handleAddConcept} className="gap-2">
                            Thêm gói dịch vụ
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="concept-name">Tên gói dịch vụ *</Label>
                            <Input
                                id="concept-name"
                                value={concepts[currentConceptIndex]?.name || ""}
                                onChange={(e) => handleConceptChange(currentConceptIndex, "name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="concept-description">Mô tả gói dịch vụ *</Label>
                            <Textarea
                                id="concept-description"
                                value={concepts[currentConceptIndex]?.description || ""}
                                onChange={(e) => handleConceptChange(currentConceptIndex, "description", e.target.value)}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="concept-price">Giá (VNĐ) *</Label>
                                <Input
                                    id="concept-price"
                                    type="number"
                                    value={concepts[currentConceptIndex]?.price || 0}
                                    onChange={(e) => handleConceptChange(currentConceptIndex, "price", Number(e.target.value))}
                                    required
                                />
                                {concepts[currentConceptIndex]?.price > 0 && (
                                    <p className="text-sm text-gray-500">{formatPrice(concepts[currentConceptIndex]?.price)}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="concept-duration">Thời gian (phút) *</Label>
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
                            <Label>Loại dịch vụ *</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {serviceTypes?.map((type) => (
                                    <Card
                                        key={type?.id}
                                        className={`cursor-pointer transition-colors border-2 ${concepts[currentConceptIndex]?.serviceTypeIds.includes(type?.id)
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
                                                {concepts[currentConceptIndex]?.serviceTypeIds.includes(type?.id) && (
                                                    <Badge className="bg-blue-100 text-blue-800" variant={"outline"}>✓</Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">
                                Đã chọn: {concepts[currentConceptIndex]?.serviceTypeIds.length} loại dịch vụ
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Ảnh gói dịch vụ (tối đa 10 ảnh)</Label>
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
                                                className="absolute top-1 right-1 h-8 w-8 p-0 text-white bg-red-500"
                                                onClick={() => removeConceptImage(currentConceptIndex, index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {conceptImagePreviews[currentConceptIndex]?.length < 10 && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <div className="text-center">
                                        <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                        <label htmlFor={`concept-images-${currentConceptIndex}`} className="cursor-pointer">
                                            <span className="text-sm font-medium text-gray-900">
                                                Thêm ảnh ({conceptImagePreviews[currentConceptIndex]?.length || 0}/10)
                                            </span>
                                            <input
                                                id={`concept-images-${currentConceptIndex}`}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                multiple
                                                onChange={(e) => handleConceptImagesChange(e, currentConceptIndex)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentConceptIndex((prev) => Math.max(0, prev - 1))}
                            disabled={currentConceptIndex === 0}
                        >
                            Gói trước
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentConceptIndex((prev) => Math.min(concepts.length - 1, prev + 1))}
                            disabled={currentConceptIndex === concepts.length - 1}
                        >
                            Gói tiếp theo
                        </Button>
                        <Button variant="outline" onClick={() => handleRemoveConcept(currentConceptIndex)} disabled={concepts.length <= 1}>
                            Xóa gói này
                        </Button>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => router.push(ROUTES.VENDOR.SERVICE_PACKAGES.VIEW.replace(':id', initialService.id))}>
                            Hủy
                        </Button>
                        <Button onClick={() => handleSubmit()} disabled={isLoading}>
                            {isLoading ? "Đang cập nhật..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
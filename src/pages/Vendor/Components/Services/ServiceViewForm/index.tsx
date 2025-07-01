"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import { Button } from "@/components/Atoms/ui/button";
import Image from "next/image";
import { Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@routes";


interface ServiceConceptImage {
    id: string;
    serviceConceptId: string;
    imageUrl: string;
    createdAt: string;
}

interface ServiceType {
    id: string;
    name: string;
}
export interface ServiceConcept {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    serviceTypes?: ServiceType[];
    serviceConceptServiceTypes?: { serviceTypeId: string; serviceType?: ServiceType }[];
    images?: ServiceConceptImage[];
}
interface ServicePackage {
    id: string;
    name: string;
    description: string;
    status: string;
    image?: string;
    serviceConcepts: ServiceConcept[];
}

interface ServiceViewDetailProps {
    service: ServicePackage;
}

export default function ServiceViewDetail({ service }: ServiceViewDetailProps) {


    const router = useRouter();
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount);

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? (mins > 0 ? `${hours} tiếng ${mins} phút` : `${hours} tiếng`) : `${mins} phút`;
    };

    // Helper: normalize service types coming from either legacy `serviceTypes` or new `serviceConceptServiceTypes` shape
    const extractServiceTypes = (concept: ServiceConcept): ServiceType[] => {
        if (concept.serviceTypes && concept.serviceTypes.length > 0) return concept.serviceTypes;
        if (concept.serviceConceptServiceTypes && concept.serviceConceptServiceTypes.length > 0) {
            return concept.serviceConceptServiceTypes
                .map((t) => t.serviceType)
                .filter((t): t is ServiceType => Boolean(t));
        }
        return [];
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <div className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Eye className="h-5 w-5" />
                                        <span className="text-xl font-bold">Chi tiết dịch vụ</span>
                                    </div>
                                    <span className="text-xl font-semibold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                                        {service?.name}
                                    </span>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                </div>
                <div className="space-y-6 bg-white p-8 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-bold text-gray-900">📝 {service?.name}</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">🚦 Trạng thái:</span>
                                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${service?.status === "hoạt động"
                                        ? "text-green-700 bg-green-100"
                                        : "text-red-700 bg-red-100"
                                    }`}>
                                    {service?.status === "hoạt động" ? "✅ Đang hoạt động" : "⏸️ Tạm dừng"}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-gray-600">📄 Mô tả:</span>
                                <div
                                    className="text-muted-foreground prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border"
                                    dangerouslySetInnerHTML={{ __html: service?.description || '' }}
                                />
                            </div>
                        </div>
                        {service?.image && (
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-gray-600">📸 Ảnh đại diện:</span>
                                <Image
                                    src={service?.image || "/placeholder.svg"}
                                    alt={service?.name}
                                    width={300}
                                    height={200}
                                    className="w-full h-64 object-cover rounded-lg border shadow-sm"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-blue-900">
                                    📦 Gói dịch vụ ({service?.serviceConcepts?.length})
                                </h3>
                                <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                                    {service?.serviceConcepts?.length || 0} gói
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {service?.serviceConcepts?.map((concept, index) => (
                                <Card key={concept.id} className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-lg text-gray-900">
                                                🏷️ {concept?.name}
                                            </CardTitle>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                Gói {index + 1}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium text-gray-600">📋 Mô tả:</span>
                                            <div
                                                className="text-muted-foreground prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border"
                                                dangerouslySetInnerHTML={{ __html: concept?.description || '' }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-600">💰</span>
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-700">Giá:</p>
                                                    <p className="font-bold text-green-700">{formatCurrency(concept?.price)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-600">⏱️</span>
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-700">Thời gian:</p>
                                                    <p className="font-bold text-blue-700">{formatDuration(concept?.duration)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-purple-600">🖼️</span>
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-700">Ảnh:</p>
                                                    <p className="font-bold text-purple-700">{concept?.images?.length || 0} ảnh</p>
                                                </div>
                                            </div>
                                        </div>
                                        {extractServiceTypes(concept).length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-600">🎯 Loại dịch vụ:</span>
                                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {extractServiceTypes(concept).length} loại
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    {extractServiceTypes(concept).map((type) => (
                                                        <span
                                                            key={type.id}
                                                            className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium"
                                                        >
                                                            {type.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {concept?.images && concept?.images?.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-600">🖼️ Ảnh gói dịch vụ:</span>
                                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {concept?.images?.length} ảnh
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                    {concept?.images?.map((image, index) => (
                                                        <div key={index} className="relative w-60 h-60 group">
                                                            <Image
                                                                src={image?.imageUrl || "/placeholder.svg"}
                                                                alt={`${concept?.name} ${index + 1}`}
                                                                fill
                                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                className="object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                                                            />
                                                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {service?.serviceConcepts?.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <div className="text-6xl mb-4">📦</div>
                                <p className="text-gray-500 text-lg font-medium">Chưa có gói dịch vụ nào</p>
                                <p className="text-gray-400 text-sm mt-2">Hãy thêm gói dịch vụ để bắt đầu</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">⬅️ Quay lại danh sách dịch vụ</span>
                            <Button
                                variant="outline"
                                onClick={() => router.push(ROUTES.VENDOR.SERVICE_PACKAGES.LIST)}
                                className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Quay lại danh sách
                            </Button>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-blue-600">✏️ Chỉnh sửa thông tin dịch vụ</span>
                            <Button
                                variant="outline"
                                onClick={() => router.push(ROUTES.VENDOR.SERVICE_PACKAGES.EDIT.replace(':id', service?.id))}
                                className="gap-2 cursor-pointer border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                                <Edit className="h-4 w-4" />
                                Chỉnh sửa
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
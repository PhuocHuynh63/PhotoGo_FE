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
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Chi tiết dịch vụ: <span className="text-primary">{service?.name}</span>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                </div>
                <div className="space-y-6 bg-white p-8 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">{service?.name}</h2>
                            <div>
                                <p className="text-sm text-gray-700">
                                    Trạng thái: {service?.status === "hoạt động" ? "Đang hoạt động" : "Tạm dừng"}
                                </p>
                            </div>
                            <p className="text-md text-gray-700">{service?.description}</p>
                        </div>
                        {service?.image && (
                            <div>
                                <Image
                                    src={service?.image || "/placeholder.svg"}
                                    alt={service?.name}
                                    width={300}
                                    height={200}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Gói dịch vụ ({service?.serviceConcepts?.length})</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {service?.serviceConcepts?.map((concept) => (
                                <Card key={concept.id} className="border-l-4 border-l-blue-500">
                                    <CardHeader className="-mb-8">
                                        <CardTitle className="text-lg">{concept?.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-gray-600">{concept?.description}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="font-semibold">Giá: <span className="font-normal">{formatCurrency(concept?.price)}</span></p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Thời gian: <span className="font-normal">{formatDuration(concept?.duration)}</span></p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Ảnh: <span className="font-normal">{concept?.images?.length} ảnh</span></p>
                                            </div>
                                        </div>
                                        {extractServiceTypes(concept).length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold">Loại dịch vụ:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {extractServiceTypes(concept).map((type) => (
                                                        <span
                                                            key={type.id}
                                                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                                        >
                                                            {type.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {concept?.images && concept?.images?.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold">Ảnh gói dịch vụ:</p>
                                                <div className="grid grid-cols-4 gap-2 my-4">
                                                    {concept?.images?.map((image, index) => (
                                                        <div key={index} className="relative w-60 h-60">
                                                            <Image
                                                                src={image?.imageUrl || "/placeholder.svg"}
                                                                alt={`${concept?.name} ${index + 1}`}
                                                                fill
                                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                className="object-cover rounded-lg"
                                                            />
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
                            <div className="text-center py-8">
                                <p className="text-gray-500">Chưa có gói dịch vụ nào</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <Button variant="outline" onClick={() => router.push(ROUTES.VENDOR.SERVICE_PACKAGES.LIST)} className="cursor-pointer">
                            Quay lại danh sách
                        </Button>
                        <Button variant="outline" onClick={() => router.push(ROUTES.VENDOR.SERVICE_PACKAGES.EDIT.replace(':id', service?.id))} className="gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
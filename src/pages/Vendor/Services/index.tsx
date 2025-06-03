"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card";
import { Button } from "@/components/Atoms/ui/button";
import { Badge } from "@/components/Atoms/ui/badge";
import { Input } from "@/components/Atoms/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select";
import { Switch } from "@/components/Atoms/ui/switch";
import { Plus, Search, Edit, Eye, MoreHorizontal, PackageIcon, Clock, DollarSign } from "lucide-react";
import ServiceModal from "@pages/Vendor/Components/Services/ServiceModal";
import { toast } from "react-hot-toast";
import { IServiceTypeModel } from "@models/serviceTypes/common.model";
import packageService from "@services/packageServices";
import { useRouter } from "next/navigation";
import { ROUTES } from "@routes";

interface ServiceConcept {
    id: string;
    name: string;
    price: number;
    duration: number;
    description: string;
    images: string[];
    serviceTypes: Array<{
        id: string;
        name: string;
        description: string;
    }>;
}

interface ServicePackage {
    id: string;
    name: string;
    description: string;
    category: string;
    status: string;
    image?: string;
    serviceConcepts: ServiceConcept[];
}

interface Vendor {
    id: string;
    servicePackages: ServicePackage[];
}

interface ServiceListProps {
    serviceTypes: IServiceTypeModel[];
    vendor: Vendor;
    onGetVendorData: () => Promise<Vendor>;
}

export default function ServiceList({ serviceTypes, vendor, onGetVendorData }: ServiceListProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vendorData, setVendorData] = useState<Vendor>({
        ...vendor,
        servicePackages: vendor?.servicePackages || [],
    });

    // Hàm để lấy dữ liệu mới từ server và cập nhật state
    const refreshVendorData = async () => {
        try {
            const newVendorData = await onGetVendorData();
            setVendorData({
                ...newVendorData,
                servicePackages: newVendorData?.servicePackages || [],
            });
        } catch (error) {
            console.error("Error refreshing vendor data:", error);
            toast.error("Có lỗi xảy ra khi cập nhật danh sách dịch vụ");
        }
    };

    // Lọc dịch vụ
    const filteredServices = (vendorData?.servicePackages || []).filter((service: ServicePackage) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" ||
            service.serviceConcepts.some((concept) =>
                concept.serviceTypes.some((type) => type.name === categoryFilter)
            );
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && service.status === "hoạt động") ||
            (statusFilter === "inactive" && service.status === "không hoạt động");

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const colorClasses = {
            "hoạt động": "bg-green-100 text-green-800",
            "không hoạt động": "bg-red-100 text-red-800",
        };

        return (
            <Badge
                variant={status === "hoạt động" ? "outline" : "destructive"}
                className={colorClasses[status as keyof typeof colorClasses]}
            >
                {status.toUpperCase()}
            </Badge>
        );
    };

    const handleToggleStatus = async (serviceId: string) => {
        const service = vendorData?.servicePackages?.find((s) => s.id === serviceId);
        if (!service) return;
        const formData = new FormData();
        formData.append("status", service.status === "hoạt động" ? "không hoạt động" : "hoạt động");
        try {
            await packageService.updatePackage(serviceId, formData);
            setVendorData((prev) => ({
                ...prev,
                servicePackages: prev.servicePackages.map((service: ServicePackage) =>
                    service.id === serviceId
                        ? { ...service, status: service.status === "hoạt động" ? "không hoạt động" : "hoạt động" }
                        : service
                ),
            }));
            toast.success("Cập nhật trạng thái dịch vụ thành công");
        } catch (error) {
            console.error("Error updating service status:", error);
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái dịch vụ");
        }
    };

    const handleViewService = (service: ServicePackage) => {
        router.push(`${ROUTES.VENDOR.SERVICE_PACKAGES.VIEW.replace(":id", service.id)}`);
    };

    const handleEditService = (service: ServicePackage) => {
        router.push(`${ROUTES.VENDOR.SERVICE_PACKAGES.EDIT.replace(":id", service.id)}`);
    };

    const handleCreateService = () => {
        setIsModalOpen(true);
    };

    const getMinPrice = (serviceConcepts: ServiceConcept[]) => {
        if (!serviceConcepts || serviceConcepts.length === 0) return null;
        return Math.min(...serviceConcepts.map((c) => Number(c.price)));
    };

    const getMinDuration = (serviceConcepts: ServiceConcept[]) => {
        if (!serviceConcepts || serviceConcepts.length === 0) return null;
        return Math.min(...serviceConcepts.map((c) => Number(c.duration)));
    };

    const formatCurrency = (amount: number | null) => {
        if (amount === null) return "Không có giá";
        return `Từ ${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)}`;
    };

    const formatDuration = (minutes: number | null) => {
        if (minutes === null) return "Không có thời gian";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return mins > 0 ? `Từ ${hours} tiếng ${mins} phút` : `Từ ${hours} tiếng`;
        }
        return `Từ ${mins} phút`;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-medium">Quản lý dịch vụ</h3>
                    <p className="text-sm text-gray-500">Quản lý các dịch vụ và gói dịch vụ của bạn</p>
                </div>
                <Button onClick={handleCreateService} className="gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Thêm dịch vụ mới
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-48 cursor-pointer">
                        <SelectValue placeholder="Tất cả danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        {serviceTypes?.map((serviceType) => (
                            <SelectItem key={serviceType.id} value={serviceType.name}>
                                {serviceType.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 cursor-pointer">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="active">Đang hoạt động</SelectItem>
                        <SelectItem value="inactive">Tạm dừng</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices?.map((service: ServicePackage) => (
                    <Card key={service.id} className="bg-white hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            {service.image && (
                                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <Image
                                        src={service.image}
                                        alt={service.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover"
                                        priority={false}
                                    />
                                </div>
                            )}
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-medium mb-2">{service.name}</CardTitle>
                                    {getStatusBadge(service.status)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={service.status === "hoạt động"}
                                        onCheckedChange={() => handleToggleStatus(service.id)}
                                    />
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <span>{formatCurrency(getMinPrice(service.serviceConcepts))}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span>{formatDuration(getMinDuration(service.serviceConcepts))}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <PackageIcon className="h-4 w-4 text-gray-500" />
                                    <span>{service.serviceConcepts.length} gói dịch vụ</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-1"
                                    onClick={() => handleViewService(service)}
                                >
                                    <Eye className="h-4 w-4" />
                                    Xem
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 gap-1"
                                    onClick={() => handleEditService(service)}
                                >
                                    <Edit className="h-4 w-4" />
                                    Sửa
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredServices.length === 0 && (
                <div className="text-center py-12">
                    <PackageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy dịch vụ nào</h3>
                    <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc tạo dịch vụ mới</p>
                    <Button onClick={handleCreateService} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Thêm dịch vụ mới
                    </Button>
                </div>
            )}

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refreshVendorData}
                serviceTypes={serviceTypes}
                vendor={vendorData}
            />
        </div>
    );
}
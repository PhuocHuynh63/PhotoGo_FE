"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Button } from "@/components/Atoms/ui/button"
import { Badge } from "@/components/Atoms/ui/badge"
import { Input } from "@/components/Atoms/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select"
import { Switch } from "@/components/Atoms/ui/switch"
import { Plus, Search, Edit, Eye, MoreHorizontal, PackageIcon, Clock, DollarSign } from "lucide-react"
import ServiceModal from "@pages/Vendor/Components/Services/ServiceModal"
import { toast } from "react-hot-toast"

import { IServiceType } from "@models/serviceTypes/common.model"
import packageService from "@services/package-services"
import vendorService from "@services/vendors"
import { IBackendResponse } from "@models/backend/backendResponse.model"

interface Service {
    id: string
    name: string
    description: string
    category: string
    isActive: boolean
    basePrice: number
    duration: number
    packages: PackageType[]
    availableBranches: string[]
}

interface PackageType {
    id: string
    name: string
    price: number
    description: string
    features: string[]
    isActive: boolean
}

interface Branch {
    id: string
    name: string
    address: string
    phone: string
    email: string
    manager: string
    isActive: boolean
    openingHours: {
        weekdays: string
        weekend: string
    }
    facilities: string[]
    services: string[]
    monthlyRevenue: number
    totalBookings: number
}

interface ServiceConcept {
    id: string
    name: string
    price: number
    duration: number
    description: string
    features: string[]
    isActive: boolean
    serviceTypes: Array<{
        id: string
        name: string
        description: string
    }>
}

interface ServicePackage {
    id: string
    name: string
    description: string
    category: string
    status: string
    image?: string
    serviceConcepts: ServiceConcept[]
}

interface Vendor {
    id: string
    servicePackages: ServicePackage[]
}

interface ServiceListProps {
    services: Service[]
    branches: Branch[]
    serviceTypes: IServiceType[]
    vendor: Vendor
}

// const mockData = {
//     serviceTypes: [
//         { id: "srv1", name: "Chụp ảnh cưới", description: "Dịch vụ chụp ảnh cưới chuyên nghiệp với nhiều gói lựa chọn" },
//         { id: "srv2", name: "Chụp ảnh gia đình", description: "Dịch vụ chụp ảnh gia đình chuyên nghiệp với nhiều gói lựa chọn" },
//         { id: "srv3", name: "Chụp ảnh sản phẩm", description: "Dịch vụ chụp ảnh sản phẩm chuyên nghiệp cho thương mại" },
//         { id: "srv4", name: "Chụp ảnh sự kiện", description: "Dịch vụ chụp ảnh sự kiện chuyên nghiệp với nhiều gói lựa chọn" },
//         { id: "srv5", name: "Chụp ảnh thời trang", description: "Dịch vụ chụp ảnh thời trang chuyên nghiệp cho model và brand" },
//     ],
//     services: [
//         {
//             id: "srv1",
//             name: "Chụp ảnh cưới",
//             description: "Dịch vụ chụp ảnh cưới chuyên nghiệp với nhiều gói lựa chọn",
//             category: "Cưới hỏi",
//             isActive: true,
//             basePrice: 5000000,
//             duration: 180, // phút
//             packages: [
//                 {
//                     id: "pkg1",
//                     name: "Gói Cơ Bản",
//                     price: 4500000,
//                     description: "Chụp trong studio, 2 bộ trang phục, album 20x30cm",
//                     features: [
//                         "Chụp trong studio 2-3 tiếng",
//                         "2 bộ trang phục cô dâu",
//                         "Trang điểm cơ bản",
//                         "Album 20x30cm (30 trang)",
//                         "File ảnh gốc (50 ảnh)",
//                     ],
//                     isActive: true,
//                 },
//                 {
//                     id: "pkg2",
//                     name: "Gói Tiêu Chuẩn",
//                     price: 7500000,
//                     description: "Studio + ngoại cảnh, 3 bộ trang phục, album cao cấp",
//                     features: [
//                         "Chụp studio + 1 địa điểm ngoại cảnh",
//                         "3 bộ trang phục cô dâu",
//                         "Trang điểm chuyên nghiệp",
//                         "Album 25x35cm (50 trang)",
//                         "File ảnh gốc (100 ảnh)",
//                         "Video highlight 2-3 phút",
//                     ],
//                     isActive: true,
//                 },
//                 {
//                     id: "pkg3",
//                     name: "Gói Cao Cấp",
//                     price: 12000000,
//                     description: "Trọn gói luxury với nhiều địa điểm và dịch vụ cao cấp",
//                     features: [
//                         "Chụp studio + 2 địa điểm ngoại cảnh",
//                         "5 bộ trang phục cô dâu",
//                         "Trang điểm + làm tóc chuyên nghiệp",
//                         "Album 30x40cm (80 trang)",
//                         "File ảnh gốc (200 ảnh)",
//                         "Video cinematic 5-7 phút",
//                         "Xe hoa trang trí",
//                     ],
//                     isActive: true,
//                 },
//             ],
//             availableBranches: ["branch1", "branch2", "branch3"],
//         },
//         {
//             id: "srv2",
//             name: "Chụp ảnh gia đình",
//             description: "Lưu giữ những khoảnh khắc đẹp của gia đình bạn",
//             category: "Gia đình",
//             isActive: true,
//             basePrice: 2000000,
//             duration: 120,
//             packages: [
//                 {
//                     id: "pkg4",
//                     name: "Gói Studio",
//                     price: 2500000,
//                     description: "Chụp gia đình trong studio với nhiều concept",
//                     features: [
//                         "Chụp trong studio 2 tiếng",
//                         "3-4 concept khác nhau",
//                         "Trang điểm nhẹ cho người lớn",
//                         "Album 20x25cm (30 trang)",
//                         "File ảnh gốc (40 ảnh)",
//                     ],
//                     isActive: true,
//                 },
//                 {
//                     id: "pkg5",
//                     name: "Gói Ngoại Cảnh",
//                     price: 3500000,
//                     description: "Chụp gia đình tại công viên hoặc địa điểm yêu thích",
//                     features: [
//                         "Chụp tại 1 địa điểm ngoại cảnh",
//                         "Thời gian chụp 2-3 tiếng",
//                         "Trang điểm nhẹ",
//                         "Album 25x30cm (40 trang)",
//                         "File ảnh gốc (60 ảnh)",
//                         "Video ngắn 1-2 phút",
//                     ],
//                     isActive: true,
//                 },
//             ],
//             availableBranches: ["branch1", "branch2"],
//         },
//         {
//             id: "srv3",
//             name: "Chụp ảnh sản phẩm",
//             description: "Dịch vụ chụp ảnh sản phẩm chuyên nghiệp cho thương mại",
//             category: "Thương mại",
//             isActive: true,
//             basePrice: 100000,
//             duration: 30,
//             packages: [
//                 {
//                     id: "pkg6",
//                     name: "Gói Cơ Bản",
//                     price: 150000,
//                     description: "Chụp sản phẩm với background trắng cơ bản",
//                     features: ["Background trắng", "5 góc chụp/sản phẩm", "Chỉnh sửa cơ bản", "File JPG chất lượng cao"],
//                     isActive: true,
//                 },
//                 {
//                     id: "pkg7",
//                     name: "Gói Cao Cấp",
//                     price: 300000,
//                     description: "Chụp sản phẩm với nhiều background và góc độ",
//                     features: [
//                         "3 loại background khác nhau",
//                         "10 góc chụp/sản phẩm",
//                         "Chỉnh sửa chuyên nghiệp",
//                         "File JPG + PNG",
//                         "Hiệu ứng đặc biệt",
//                     ],
//                     isActive: true,
//                 },
//             ],
//             availableBranches: ["branch1", "branch3"],
//         },
//         {
//             id: "srv4",
//             name: "Chụp ảnh sự kiện",
//             description: "Ghi lại những khoảnh khắc đáng nhớ trong sự kiện của bạn",
//             category: "Sự kiện",
//             isActive: true,
//             basePrice: 3000000,
//             duration: 240,
//             packages: [
//                 {
//                     id: "pkg8",
//                     name: "Gói Nửa Ngày",
//                     price: 4000000,
//                     description: "Chụp sự kiện trong 4 tiếng",
//                     features: [
//                         "1 photographer chính",
//                         "Chụp 4 tiếng liên tục",
//                         "File ảnh gốc (200 ảnh)",
//                         "Chỉnh sửa cơ bản",
//                         "Giao file trong 3 ngày",
//                     ],
//                     isActive: true,
//                 },
//                 {
//                     id: "pkg9",
//                     name: "Gói Cả Ngày",
//                     price: 7000000,
//                     description: "Chụp sự kiện cả ngày với team photographer",
//                     features: [
//                         "2 photographer",
//                         "Chụp 8 tiếng",
//                         "File ảnh gốc (500 ảnh)",
//                         "Chỉnh sửa chuyên nghiệp",
//                         "Video highlight 3-5 phút",
//                         "Album kỷ niệm",
//                         "Giao file trong 5 ngày",
//                     ],
//                     isActive: true,
//                 },
//             ],
//             availableBranches: ["branch1", "branch2", "branch3"],
//         },
//         {
//             id: "srv5",
//             name: "Chụp ảnh thời trang",
//             description: "Dịch vụ chụp ảnh thời trang chuyên nghiệp cho model và brand",
//             category: "Thời trang",
//             isActive: false,
//             basePrice: 5000000,
//             duration: 300,
//             packages: [
//                 {
//                     id: "pkg10",
//                     name: "Gói Lookbook",
//                     price: 8000000,
//                     description: "Chụp lookbook cho thương hiệu thời trang",
//                     features: [
//                         "1 model chuyên nghiệp",
//                         "Makeup artist",
//                         "5 bộ trang phục",
//                         "Studio + 1 địa điểm ngoại cảnh",
//                         "File ảnh chất lượng cao (100 ảnh)",
//                         "Chỉnh sửa chuyên nghiệp",
//                     ],
//                     isActive: false,
//                 },
//             ],
//             availableBranches: ["branch1"],
//         },
//     ],
//     branches: [
//         {
//             id: "branch1",
//             name: "Chi nhánh Quận 1",
//             address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
//             phone: "028 3822 1234",
//             email: "quan1@anhduongstudio.com",
//             manager: "Nguyễn Văn A",
//             isActive: true,
//             openingHours: {
//                 weekdays: "08:00 - 18:00",
//                 weekend: "08:00 - 20:00",
//             },
//             facilities: [
//                 "Studio chụp ảnh cưới 200m²",
//                 "Phòng trang điểm riêng",
//                 "Kho trang phục 500+ bộ",
//                 "Thiết bị chụp ảnh hiện đại",
//                 "Phòng nghỉ cho khách hàng",
//             ],
//             services: ["srv1", "srv2", "srv3", "srv4", "srv5"],
//             monthlyRevenue: 450000000,
//             totalBookings: 85,
//         },
//         {
//             id: "branch2",
//             name: "Chi nhánh Quận 7",
//             address: "456 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM",
//             phone: "028 3777 5678",
//             email: "quan7@anhduongstudio.com",
//             manager: "Trần Thị B",
//             isActive: true,
//             openingHours: {
//                 weekdays: "08:00 - 18:00",
//                 weekend: "08:00 - 20:00",
//             },
//             facilities: [
//                 "Studio chụp ảnh gia đình 150m²",
//                 "Khu vực chụp ảnh trẻ em",
//                 "Phòng trang điểm",
//                 "Kho props đa dạng",
//                 "Bãi đỗ xe rộng rãi",
//             ],
//             services: ["srv1", "srv2", "srv4"],
//             monthlyRevenue: 320000000,
//             totalBookings: 62,
//         },
//         {
//             id: "branch3",
//             name: "Chi nhánh Thủ Đức",
//             address: "789 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP.HCM",
//             phone: "028 3896 9012",
//             email: "thuduc@anhduongstudio.com",
//             manager: "Lê Văn C",
//             isActive: true,
//             openingHours: {
//                 weekdays: "08:00 - 18:00",
//                 weekend: "08:00 - 20:00",
//             },
//             facilities: [
//                 "Studio sản phẩm chuyên nghiệp",
//                 "Phòng chụp ảnh 360°",
//                 "Kho background đa dạng",
//                 "Thiết bị ánh sáng cao cấp",
//                 "Phòng hậu kỳ riêng",
//             ],
//             services: ["srv1", "srv3", "srv4"],
//             monthlyRevenue: 280000000,
//             totalBookings: 48,
//         },
//     ],
// }

export default function ServiceList({ services, branches, serviceTypes, vendor }: ServiceListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedService, setSelectedService] = useState<ServicePackage | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view")
    const [vendorData, setVendorData] = useState<Vendor>({
        ...vendor,
        servicePackages: vendor?.servicePackages || []
    })

    const handleServicesChange = (updatedServices: ServicePackage[]) => {
        // TODO: Implement API call to update services
        console.log('Services updated:', updatedServices)
    }

    // Lọc dịch vụ
    const filteredServices = (vendorData?.servicePackages || []).filter((service: ServicePackage) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" ||
            service.serviceConcepts.some(concept =>
                concept.serviceTypes.some(type => type.name === categoryFilter)
            )
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && service.status === "hoạt động") ||
            (statusFilter === "inactive" && service.status === "không hoạt động")

        return matchesSearch && matchesCategory && matchesStatus
    })


    const getStatusBadge = (status: string) => {

        const colorClasses = {
            "hoạt động": "bg-green-100 text-green-800",
            "không hoạt động": "bg-red-100 text-red-800",
        }

        return (
            <Badge variant={status === "hoạt động" ? "outline" : "destructive"} className={colorClasses[status as keyof typeof colorClasses]}>
                {status.toUpperCase()}
            </Badge>
        )
    }

    const handleToggleStatus = (serviceId: string) => {
        const updatedServices = vendorData?.servicePackages?.map((service: ServicePackage) =>
            service.id === serviceId ? { ...service, status: service.status === "hoạt động" ? "không hoạt động" : "hoạt động" } : service,
        )
        handleServicesChange(updatedServices)
    }

    const handleViewService = (service: ServicePackage) => {
        setSelectedService(service)
        setModalMode("view")
        setIsModalOpen(true)
    }

    const handleEditService = (service: ServicePackage) => {
        setSelectedService(service)
        setModalMode("edit")
        setIsModalOpen(true)
    }

    const handleCreateService = () => {
        setSelectedService(null)
        setModalMode("create")
        setIsModalOpen(true)
    }


    const handleCreateSuccess = async () => {
        try {
            const response = await vendorService.getVendorById(vendor?.id) as IBackendResponse<any>
            const data = response.data as Vendor
            if (response.statusCode === 200) {
                setVendorData(prev => ({
                    ...prev,
                    servicePackages: data?.servicePackages || []
                }))
            }
        } catch (error) {
            console.error("Error refreshing services:", error)
            toast.error("Có lỗi xảy ra khi cập nhật danh sách dịch vụ")
        }
    }

    const getMinPrice = (serviceConcepts: ServiceConcept[]) => {
        if (!serviceConcepts || serviceConcepts.length === 0) return null;
        return Math.min(...serviceConcepts.map(c => Number(c.price)));
    };
    const getMinDuration = (serviceConcepts: ServiceConcept[]) => {
        if (!serviceConcepts || serviceConcepts.length === 0) return null;
        return Math.min(...serviceConcepts.map(c => Number(c.duration)));
    };

    const formatCurrency = (amount: number | null) => {
        if (amount === null) return "Không có giá"
        return `Từ ${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)}`
    }

    const formatDuration = (minutes: number | null) => {
        if (minutes === null) return "Không có thời gian"
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours > 0) {
            return mins > 0 ? `Từ ${hours} tiếng ${mins} phút` : `Từ ${hours} tiếng`
        }
        return `Từ ${mins} phút`
    }
    return (
        <div className="space-y-4">
            {/* Header và filters */}
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

            {/* Filters */}
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

            {/* Service Grid */}
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
                                    <Switch checked={service.status === "hoạt động"} onCheckedChange={() => handleToggleStatus(service.id)} />
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
                                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleViewService(service)}>
                                    <Eye className="h-4 w-4" />
                                    Xem
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEditService(service)}>
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
                onSuccess={handleCreateSuccess}
                serviceTypes={serviceTypes}
                mode={modalMode}
                vendor={vendorData}
            />
        </div>
    )
}

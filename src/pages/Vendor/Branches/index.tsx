"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Button } from "@/components/Atoms/ui/button"
import { Badge } from "@/components/Atoms/ui/badge"
import { Input } from "@/components/Atoms/ui/input"
import { Switch } from "@/components/Atoms/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Atoms/ui/avatar"
import { Plus, Search, Edit, Eye, MoreHorizontal, MapPin, Phone, Mail, Clock, DollarSign, Calendar } from "lucide-react"
import BranchModal from "@pages/Vendor/Components/Services/BranchModal"

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

interface Package {
    id: string
    name: string
    price: number
    description: string
    features: string[]
    isActive: boolean
}

interface Service {
    id: string
    name: string
    description: string
    category: string
    isActive: boolean
    basePrice: number
    duration: number
    packages: Package[]
    availableBranches: string[]
}

interface BranchListProps {
    branches: Branch[]
    services: Service[]
}

const mockData = {
    branches: [
        {
            id: "branch1",
            name: "Chi nhánh Quận 1",
            address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
            phone: "028 3822 1234",
            email: "quan1@anhduongstudio.com",
            manager: "Nguyễn Văn A",
            isActive: true,
            openingHours: {
                weekdays: "08:00 - 18:00",
                weekend: "08:00 - 20:00",
            },
            facilities: [
                "Studio chụp ảnh cưới 200m²",
                "Phòng trang điểm riêng",
                "Kho trang phục 500+ bộ",
                "Thiết bị chụp ảnh hiện đại",
                "Phòng nghỉ cho khách hàng",
            ],
            services: ["srv1", "srv2", "srv3", "srv4", "srv5"],
            monthlyRevenue: 450000000,
            totalBookings: 85,
        },
        {
            id: "branch2",
            name: "Chi nhánh Quận 7",
            address: "456 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM",
            phone: "028 3777 5678",
            email: "quan7@anhduongstudio.com",
            manager: "Trần Thị B",
            isActive: true,
            openingHours: {
                weekdays: "08:00 - 18:00",
                weekend: "08:00 - 20:00",
            },
            facilities: [
                "Studio chụp ảnh gia đình 150m²",
                "Khu vực chụp ảnh trẻ em",
                "Phòng trang điểm",
                "Kho props đa dạng",
                "Bãi đỗ xe rộng rãi",
            ],
            services: ["srv1", "srv2", "srv4"],
            monthlyRevenue: 320000000,
            totalBookings: 62,
        },
        {
            id: "branch3",
            name: "Chi nhánh Thủ Đức",
            address: "789 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP.HCM",
            phone: "028 3896 9012",
            email: "thuduc@anhduongstudio.com",
            manager: "Lê Văn C",
            isActive: true,
            openingHours: {
                weekdays: "08:00 - 18:00",
                weekend: "08:00 - 20:00",
            },
            facilities: [
                "Studio sản phẩm chuyên nghiệp",
                "Phòng chụp ảnh 360°",
                "Kho background đa dạng",
                "Thiết bị ánh sáng cao cấp",
                "Phòng hậu kỳ riêng",
            ],
            services: ["srv1", "srv3", "srv4"],
            monthlyRevenue: 280000000,
            totalBookings: 48,
        },
    ],
    categories: [
        { id: "cat1", name: "Cưới hỏi", color: "blue" },
        { id: "cat2", name: "Gia đình", color: "green" },
        { id: "cat3", name: "Thương mại", color: "purple" },
        { id: "cat4", name: "Sự kiện", color: "orange" },
        { id: "cat5", name: "Thời trang", color: "red" },
    ],

}

export default function BranchList({ branches, services }: BranchListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view")

    const handleBranchesChange = (updatedBranches: Branch[]) => {
        // TODO: Implement API call to update branches
        console.log('Branches updated:', updatedBranches)
    }

    // Lọc chi nhánh
    const filteredBranches = mockData.branches.filter((branch) => {
        const matchesSearch =
            branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const getServiceNames = (serviceIds: string[]) => {
        return serviceIds?.map((id) => {
            const service = services?.find((s) => s.id === id)
            return service?.name || "Unknown"
        })
    }

    const handleToggleStatus = (branchId: string) => {
        const updatedBranches = mockData.branches?.map((branch) =>
            branch.id === branchId ? { ...branch, isActive: !branch.isActive } : branch,
        )
        handleBranchesChange(updatedBranches)
    }

    const handleViewBranch = (branch: Branch) => {
        setSelectedBranch(branch)
        setModalMode("view")
        setIsModalOpen(true)
    }

    const handleEditBranch = (branch: Branch) => {
        setSelectedBranch(branch)
        setModalMode("edit")
        setIsModalOpen(true)
    }

    const handleCreateBranch = () => {
        setSelectedBranch(null)
        setModalMode("create")
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedBranch(null)
    }

    return (
        <div className="space-y-4">
            {/* Header và filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-medium">Quản lý chi nhánh</h3>
                    <p className="text-sm text-gray-500">Quản lý các chi nhánh và thông tin hoạt động</p>
                </div>
                <Button onClick={handleCreateBranch} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm chi nhánh mới
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Tìm kiếm chi nhánh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Branch Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBranches?.map((branch) => (
                    <Card key={branch?.id} className="bg-white hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-medium mb-2">{branch?.name}</CardTitle>
                                    <Badge className={branch?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                        {branch?.isActive ? "Đang hoạt động" : "Tạm dừng"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch checked={branch?.isActive} onCheckedChange={() => handleToggleStatus(branch?.id)} />
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Thông tin liên hệ */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <span className="line-clamp-2">{branch?.address}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{branch?.phone}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>{branch?.email}</span>
                                </div>
                            </div>

                            {/* Quản lý */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg" alt={branch?.manager} />
                                    <AvatarFallback>{branch?.manager.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{branch?.manager}</p>
                                    <p className="text-xs text-gray-500">Quản lý chi nhánh</p>
                                </div>
                            </div>

                            {/* Thống kê */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <DollarSign className="h-4 w-4 text-blue-600" />
                                        <span className="text-xs text-blue-600 font-medium">Doanh thu tháng</span>
                                    </div>
                                    <p className="text-sm font-bold text-blue-700">{formatCurrency(branch?.monthlyRevenue)}</p>
                                </div>

                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Calendar className="h-4 w-4 text-green-600" />
                                        <span className="text-xs text-green-600 font-medium">Lịch hẹn</span>
                                    </div>
                                    <p className="text-sm font-bold text-green-700">{branch?.totalBookings}</p>
                                </div>
                            </div>

                            {/* Dịch vụ */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Dịch vụ cung cấp:</p>
                                <div className="flex flex-wrap gap-1">
                                    {getServiceNames(branch?.services)
                                        ?.slice(0, 3)
                                        ?.map((serviceName, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {serviceName}
                                            </Badge>
                                        ))}
                                    {branch?.services?.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{branch?.services?.length - 3} khác
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Giờ hoạt động */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Giờ hoạt động:</span>
                                </div>
                                <div className="text-xs text-gray-600 ml-6">
                                    <p>T2-T6: {branch?.openingHours.weekdays}</p>
                                    <p>T7-CN: {branch?.openingHours.weekend}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleViewBranch(branch)}>
                                    <Eye className="h-4 w-4" />
                                    Xem
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEditBranch(branch)}>
                                    <Edit className="h-4 w-4" />
                                    Sửa
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredBranches?.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy chi nhánh nào</h3>
                    <p className="text-gray-500 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc tạo chi nhánh mới</p>
                    <Button onClick={handleCreateBranch} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Thêm chi nhánh mới
                    </Button>
                </div>
            )}

            <BranchModal
                branch={selectedBranch}
                services={services}
                mode={modalMode}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={(updatedBranch) => {
                    if (modalMode === "create") {
                        handleBranchesChange([...mockData.branches, { ...updatedBranch, id: `branch${Date.now()}` }])
                    } else {
                        const updatedBranches = mockData.branches?.map((b) => (b.id === updatedBranch.id ? updatedBranch : b))
                        handleBranchesChange(updatedBranches)
                    }
                    handleCloseModal()
                }}
            />
        </div>
    )
}

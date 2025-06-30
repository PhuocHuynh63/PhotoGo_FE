"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/ui/card"
import { Button } from "@/components/Atoms/ui/button"
import { Badge } from "@/components/Atoms/ui/badge"
import { Input } from "@/components/Atoms/ui/input"
import { Switch } from "@/components/Atoms/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Atoms/ui/avatar"
import { Plus, Search, Edit, Eye, MoreHorizontal, MapPin, Phone, Mail, Clock, DollarSign, Calendar, Map, Loader2 } from "lucide-react"
import BranchModal from "@pages/Vendor/Components/Services/BranchModal"
import { useBranches } from "@utils/hooks/useBranches"

interface Branch {
    id: string
    address: string
    city: string
    district: string
    province: string
    ward: string
    latitude: string
    longitude: string
    // Optional fields for backward compatibility
    name?: string
    phone?: string
    email?: string
    manager?: string
    isActive?: boolean
    openingHours?: {
        weekdays: string
        weekend: string
    }
    facilities?: string[]
    services?: string[]
    monthlyRevenue?: number
    totalBookings?: number
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
    vendorId: string | undefined
}

// Mock data for demonstration - you can remove this when using real data
const mockServices = [
    { id: "srv1", name: "Chụp ảnh cưới", description: "Dịch vụ chụp ảnh cưới chuyên nghiệp", category: "Cưới hỏi", isActive: true, basePrice: 5000000, duration: 8, packages: [], availableBranches: [] },
    { id: "srv2", name: "Chụp ảnh gia đình", description: "Chụp ảnh gia đình ấm cúng", category: "Gia đình", isActive: true, basePrice: 2000000, duration: 4, packages: [], availableBranches: [] },
    { id: "srv3", name: "Chụp ảnh sản phẩm", description: "Chụp ảnh sản phẩm thương mại", category: "Thương mại", isActive: true, basePrice: 1000000, duration: 2, packages: [], availableBranches: [] },
]

export default function BranchList({ branches = [], services = mockServices, vendorId }: BranchListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view")

    // Use the custom hook for branch management
    const {
        branches: managedBranches,
        loading,
        createBranch,
        updateBranch,
        deleteBranch,
        toggleBranchStatus,
        refreshBranches
    } = useBranches(branches)

    // Initialize branches when component mounts or branches prop changes
    React.useEffect(() => {
        refreshBranches(branches)
    }, [branches, refreshBranches])

    // Lọc chi nhánh
    const filteredBranches = managedBranches.filter((branch) => {
        const fullAddress = `${branch.address}, ${branch.ward}, ${branch.district}, ${branch.city}, ${branch.province}`.toLowerCase()
        const matchesSearch = fullAddress.includes(searchTerm.toLowerCase())
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
        toggleBranchStatus(branchId)
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

    const handleSaveBranch = async (branchData: Branch) => {
        if (modalMode === "create" && vendorId) {
            const apiData = {
                address: branchData.address,
                district: branchData.district,
                ward: branchData.ward,
                city: branchData.city,
                province: branchData.province,
                latitude: parseFloat(branchData.latitude),
                longitude: parseFloat(branchData.longitude),
                // name: branchData.name,
                // phone: branchData.phone,
                // email: branchData.email,
                // manager: branchData.manager,
                // isActive: branchData.isActive,
                // openingHours: branchData.openingHours,
                // facilities: branchData.facilities,
                // services: branchData.services,
                // monthlyRevenue: branchData.monthlyRevenue,
                // totalBookings: branchData.totalBookings,
            }

            const result = await createBranch(vendorId, apiData)
            if (result.success) {
                handleCloseModal()
            }
        } else if (modalMode === "edit" && branchData.id) {
            const apiData = {
                address: branchData.address,
                district: branchData.district,
                ward: branchData.ward,
                city: branchData.city,
                province: branchData.province,
                latitude: parseFloat(branchData.latitude),
                longitude: parseFloat(branchData.longitude),
                // name: branchData.name,
                // phone: branchData.phone,
                // email: branchData.email,
                // manager: branchData.manager,
                // isActive: branchData.isActive,
                // openingHours: branchData.openingHours,
                // facilities: branchData.facilities,
                // services: branchData.services,
                // monthlyRevenue: branchData.monthlyRevenue,
                // totalBookings: branchData.totalBookings,
            }

            const result = await updateBranch(branchData.id, apiData)
            if (result.success) {
                handleCloseModal()
            }
        }
    }

    const handleDeleteBranch = async (branchId: string) => {
        const result = await deleteBranch(branchId)
        if (result.success) {
            handleCloseModal()
        }
    }

    const getBranchName = (branch: Branch) => {
        return branch.name || `Chi nhánh ${branch.district}`
    }

    return (
        <div className="space-y-4">
            {/* Header và filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-medium">Quản lý chi nhánh</h3>
                    <p className="text-sm text-gray-500">Quản lý các chi nhánh và thông tin hoạt động</p>
                </div>
                <Button onClick={handleCreateBranch} className="gap-2" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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
                                    <CardTitle className="text-lg font-medium mb-2">{getBranchName(branch)}</CardTitle>
                                    <Badge variant='outline' className={branch?.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                        {branch?.isActive !== false ? "Đang hoạt động" : "Tạm dừng"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={branch?.isActive !== false}
                                        onCheckedChange={() => handleToggleStatus(branch?.id)}
                                    />
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Thông tin địa chỉ */}
                            <div className="space-y-2">
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium">{branch?.address}</p>
                                        <p className="text-gray-600">{branch?.ward}, {branch?.district}</p>
                                        <p className="text-gray-600">{branch?.city}, {branch?.province}</p>
                                    </div>
                                </div>

                                {/* Tọa độ */}
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Map className="h-4 w-4" />
                                    <span>{branch?.latitude}, {branch?.longitude}</span>
                                </div>

                                {/* Thông tin liên hệ (nếu có) */}
                                {branch?.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span>{branch?.phone}</span>
                                    </div>
                                )}

                                {branch?.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span>{branch?.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Quản lý (nếu có) */}
                            {branch?.manager && (
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
                            )}

                            {/* Thống kê (nếu có) */}
                            {(branch?.monthlyRevenue || branch?.totalBookings) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {branch?.monthlyRevenue && (
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <DollarSign className="h-4 w-4 text-blue-600" />
                                                <span className="text-xs text-blue-600 font-medium">Doanh thu tháng</span>
                                            </div>
                                            <p className="text-sm font-bold text-blue-700">{formatCurrency(branch?.monthlyRevenue)}</p>
                                        </div>
                                    )}

                                    {branch?.totalBookings && (
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Calendar className="h-4 w-4 text-green-600" />
                                                <span className="text-xs text-green-600 font-medium">Lịch hẹn</span>
                                            </div>
                                            <p className="text-sm font-bold text-green-700">{branch?.totalBookings}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Dịch vụ (nếu có) */}
                            {branch?.services && branch?.services.length > 0 && (
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
                            )}

                            {/* Giờ hoạt động (nếu có) */}
                            {branch?.openingHours && (
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
                            )}

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
                    <Button onClick={handleCreateBranch} className="gap-2" disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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
                onSave={handleSaveBranch}
                onDelete={handleDeleteBranch}
            />
        </div>
    )
}

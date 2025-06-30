"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/Atoms/ui/dialog"
import { Button } from "@/components/Atoms/ui/button"
import { Input } from "@/components/Atoms/ui/input"
import { Label } from "@/components/Atoms/ui/label"
import { Switch } from "@/components/Atoms/ui/switch"
import { Badge } from "@/components/Atoms/ui/badge"
import { Separator } from "@/components/Atoms/ui/separator"
import { Checkbox } from "@/components/Atoms/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Atoms/ui/avatar"
import { Plus, Trash2, MapPin, Clock, Users, Settings, Map, Loader2 } from "lucide-react"
import BranchService from "@services/branch"

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

interface Service {
    id: string
    name: string
    description: string
    category: string
    isActive: boolean
    basePrice: number
    duration: number
    packages: unknown[]
    availableBranches: string[]
}

interface BranchModalProps {
    branch: Branch | null
    services: Service[]
    mode: "view" | "edit" | "create"
    isOpen: boolean
    onClose: () => void
    onSave: (branch: Branch) => void
    onDelete?: (branchId: string) => void
}

export default function BranchModal({ branch, services, mode, isOpen, onClose, onSave, onDelete }: BranchModalProps) {
    const [formData, setFormData] = useState<Branch>({
        id: "",
        address: "",
        city: "",
        district: "",
        province: "",
        ward: "",
        latitude: "",
        longitude: "",
        // name: "",
        // phone: "",
        // email: "",
        // manager: "",
        // isActive: true,
        // openingHours: {
        //     weekdays: "08:00 - 18:00",
        //     weekend: "08:00 - 20:00",
        // },
        // facilities: [],
        // services: [],
        // monthlyRevenue: 0,
        // totalBookings: 0,
    })

    const [newFacility, setNewFacility] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (branch && (mode === "view" || mode === "edit")) {
            setFormData(branch)
        } else if (mode === "create") {
            setFormData({
                id: "",
                address: "",
                city: "",
                district: "",
                province: "",
                ward: "",
                latitude: "",
                longitude: "",
                name: "",
                phone: "",
                email: "",
                manager: "",
                isActive: true,
                openingHours: {
                    weekdays: "08:00 - 18:00",
                    weekend: "08:00 - 20:00",
                },
                facilities: [],
                services: [],
                monthlyRevenue: 0,
                totalBookings: 0,
            })
        }
    }, [branch, mode])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const handleInputChange = (field: keyof Branch, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleOpeningHoursChange = (type: "weekdays" | "weekend", value: string) => {
        setFormData((prev) => ({
            ...prev,
            openingHours: {
                weekdays: prev.openingHours?.weekdays || "08:00 - 18:00",
                weekend: prev.openingHours?.weekend || "08:00 - 20:00",
                [type]: value,
            },
        }))
    }

    const handleServiceToggle = (serviceId: string) => {
        const updatedServices = formData.services?.includes(serviceId)
            ? formData.services.filter((id) => id !== serviceId)
            : [...(formData.services || []), serviceId]

        handleInputChange("services", updatedServices)
    }

    const handleAddFacility = () => {
        if (newFacility.trim()) {
            handleInputChange("facilities", [...(formData.facilities || []), newFacility.trim()])
            setNewFacility("")
        }
    }

    const handleRemoveFacility = (index: number) => {
        const updatedFacilities = (formData.facilities || []).filter((_, i) => i !== index)
        handleInputChange("facilities", updatedFacilities)
    }

    const validateForm = () => {
        const requiredFields = ['address', 'city', 'district', 'province', 'ward', 'latitude', 'longitude']
        const missingFields = requiredFields.filter(field => !formData[field as keyof Branch])

        if (missingFields.length > 0) {
            console.error(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`)
            return false
        }

        // Validate coordinates
        const lat = parseFloat(formData.latitude)
        const lng = parseFloat(formData.longitude)

        if (isNaN(lat) || isNaN(lng)) {
            console.error("Tọa độ không hợp lệ")
            return false
        }

        if (lat < -90 || lat > 90) {
            console.error("Vĩ độ phải từ -90 đến 90")
            return false
        }

        if (lng < -180 || lng > 180) {
            console.error("Kinh độ phải từ -180 đến 180")
            return false
        }

        return true
    }

    const handleSave = async () => {
        if (!validateForm()) return

        setIsLoading(true)
        try {
            // Call the parent's onSave function which handles the API calls
            onSave(formData)
        } catch (error) {
            console.error('Error saving branch:', error)
            console.error("Có lỗi xảy ra khi lưu chi nhánh")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!formData.id) return

        if (confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
            setIsLoading(true)
            try {
                if (onDelete) {
                    onDelete(formData.id)
                } else {
                    // Fallback to direct API call if onDelete is not provided
                    const response = await BranchService.deleteBranch(formData.id) as { statusCode: number }

                    if (response?.statusCode === 200 || response?.statusCode === 204) {
                        console.log("Xóa chi nhánh thành công!")
                        onClose()
                    } else {
                        console.error("Có lỗi xảy ra khi xóa chi nhánh")
                    }
                }
            } catch (error) {
                console.error('Error deleting branch:', error)
                console.error("Có lỗi xảy ra khi xóa chi nhánh")
            } finally {
                setIsLoading(false)
            }
        }
    }

    const isReadOnly = mode === "view"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Thêm chi nhánh mới" : mode === "edit" ? "Chỉnh sửa chi nhánh" : "Chi tiết chi nhánh"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Tạo chi nhánh mới cho hệ thống"
                            : mode === "edit"
                                ? "Cập nhật thông tin chi nhánh"
                                : "Xem chi tiết thông tin chi nhánh"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Thông tin cơ bản
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên chi nhánh</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ""}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Nhập tên chi nhánh (tùy chọn)"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="manager">Quản lý</Label>
                                <Input
                                    id="manager"
                                    value={formData.manager || ""}
                                    onChange={(e) => handleInputChange("manager", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Tên quản lý chi nhánh (tùy chọn)"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone || ""}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Số điện thoại liên hệ (tùy chọn)"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Email chi nhánh (tùy chọn)"
                                />
                            </div>
                        </div>

                        {!isReadOnly && (
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive !== false}
                                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                                />
                                <Label htmlFor="isActive">Kích hoạt chi nhánh</Label>
                            </div>
                        )}

                        {isReadOnly && (
                            <div className="flex items-center gap-4">
                                {formData.manager && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="/placeholder.svg" alt={formData.manager} />
                                            <AvatarFallback>{formData.manager.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{formData.manager}</p>
                                            <p className="text-sm text-gray-500">Quản lý chi nhánh</p>
                                        </div>
                                    </div>
                                )}
                                <Badge variant='outline' className={formData.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {formData.isActive !== false ? "Đang hoạt động" : "Tạm dừng"}
                                </Badge>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Thông tin địa chỉ */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Thông tin địa chỉ <span className="text-red-500">*</span>
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ <span className="text-red-500">*</span></Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                disabled={isReadOnly}
                                placeholder="Số nhà, đường"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ward">Phường/Xã <span className="text-red-500">*</span></Label>
                                <Input
                                    id="ward"
                                    value={formData.ward}
                                    onChange={(e) => handleInputChange("ward", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Phường/Xã"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district">Quận/Huyện <span className="text-red-500">*</span></Label>
                                <Input
                                    id="district"
                                    value={formData.district}
                                    onChange={(e) => handleInputChange("district", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Quận/Huyện"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">Thành phố <span className="text-red-500">*</span></Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Thành phố"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="province">Tỉnh <span className="text-red-500">*</span></Label>
                                <Input
                                    id="province"
                                    value={formData.province}
                                    onChange={(e) => handleInputChange("province", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Tỉnh"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="latitude">Vĩ độ <span className="text-red-500">*</span></Label>
                                <Input
                                    id="latitude"
                                    value={formData.latitude}
                                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Ví dụ: 10.776900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="longitude">Kinh độ <span className="text-red-500">*</span></Label>
                                <Input
                                    id="longitude"
                                    value={formData.longitude}
                                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Ví dụ: 106.700900"
                                />
                            </div>
                        </div>

                        {/* Hiển thị địa chỉ đầy đủ khi xem */}
                        {isReadOnly && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium">{formData.address}</p>
                                        <p className="text-gray-600">{formData.ward}, {formData.district}</p>
                                        <p className="text-gray-600">{formData.city}, {formData.province}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <Map className="h-4 w-4" />
                                            <span>{formData.latitude}, {formData.longitude}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Giờ hoạt động */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Giờ hoạt động
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weekdays">Thứ 2 - Thứ 6</Label>
                                <Input
                                    id="weekdays"
                                    value={formData.openingHours?.weekdays || ""}
                                    onChange={(e) => handleOpeningHoursChange("weekdays", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="08:00 - 18:00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="weekend">Thứ 7 - Chủ nhật</Label>
                                <Input
                                    id="weekend"
                                    value={formData.openingHours?.weekend || ""}
                                    onChange={(e) => handleOpeningHoursChange("weekend", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="08:00 - 20:00"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Dịch vụ cung cấp */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Dịch vụ cung cấp ({(formData?.services?.length || 0)})
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {services?.map((service) => (
                                <div key={service.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={service.id}
                                        checked={formData?.services?.includes(service.id) || false}
                                        onCheckedChange={() => handleServiceToggle(service.id)}
                                        disabled={isReadOnly}
                                    />
                                    <Label htmlFor={service.id} className="text-sm flex-1">
                                        <div>
                                            <span className="font-medium">{service.name}</span>
                                            <span className="text-gray-500 ml-2">({service.category})</span>
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Cơ sở vật chất */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Cơ sở vật chất</h3>

                        {/* Existing facilities */}
                        <div className="space-y-2">
                            {(formData?.facilities || []).map((facility, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm">{facility}</span>
                                    {!isReadOnly && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveFacility(index)}
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add new facility */}
                        {!isReadOnly && (
                            <div className="flex gap-2">
                                <Input
                                    value={newFacility}
                                    onChange={(e) => setNewFacility(e.target.value)}
                                    placeholder="Thêm cơ sở vật chất mới"
                                    onKeyPress={(e) => e.key === "Enter" && handleAddFacility()}
                                />
                                <Button onClick={handleAddFacility} size="sm" className="gap-1">
                                    <Plus className="h-4 w-4" />
                                    Thêm
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Thống kê (chỉ hiển thị khi xem) */}
                    {isReadOnly && (formData?.monthlyRevenue || formData?.totalBookings) && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Thống kê hoạt động</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData?.monthlyRevenue && (
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="h-5 w-5 text-blue-600" />
                                                <span className="font-medium text-blue-900">Doanh thu tháng này</span>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-700">{formatCurrency(formData.monthlyRevenue)}</p>
                                        </div>
                                    )}

                                    {formData?.totalBookings && (
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="h-5 w-5 text-green-600" />
                                                <span className="font-medium text-green-900">Tổng lịch hẹn</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-700">{formData.totalBookings}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        {isReadOnly ? "Đóng" : "Hủy"}
                    </Button>
                    {mode === "edit" && (
                        <Button
                            variant="outline"
                            className="text-red-500"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Xóa
                        </Button>
                    )}
                    {!isReadOnly && (
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "create" ? "Tạo chi nhánh" : "Lưu thay đổi"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

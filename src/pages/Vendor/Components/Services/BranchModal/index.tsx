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
import { Textarea } from "@/components/Atoms/ui/textarea"
import { Switch } from "@/components/Atoms/ui/switch"
import { Badge } from "@/components/Atoms/ui/badge"
import { Separator } from "@/components/Atoms/ui/separator"
import { Checkbox } from "@/components/Atoms/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Atoms/ui/avatar"
import { Plus, Trash2, MapPin, Clock, Users, Settings } from "lucide-react"

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

interface Service {
    id: string
    name: string
    description: string
    category: string
    isActive: boolean
    basePrice: number
    duration: number
    packages: any[]
    availableBranches: string[]
}

interface BranchModalProps {
    branch: Branch | null
    services: Service[]
    mode: "view" | "edit" | "create"
    isOpen: boolean
    onClose: () => void
    onSave: (branch: Branch) => void
}

export default function BranchModal({ branch, services, mode, isOpen, onClose, onSave }: BranchModalProps) {
    const [formData, setFormData] = useState<Branch>({
        id: "",
        name: "",
        address: "",
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

    const [newFacility, setNewFacility] = useState("")

    useEffect(() => {
        if (branch && (mode === "view" || mode === "edit")) {
            setFormData(branch)
        } else if (mode === "create") {
            setFormData({
                id: "",
                name: "",
                address: "",
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

    const handleInputChange = (field: keyof Branch, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleOpeningHoursChange = (type: "weekdays" | "weekend", value: string) => {
        setFormData((prev) => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [type]: value,
            },
        }))
    }

    const handleServiceToggle = (serviceId: string) => {
        const updatedServices = formData.services.includes(serviceId)
            ? formData.services.filter((id) => id !== serviceId)
            : [...formData.services, serviceId]

        handleInputChange("services", updatedServices)
    }

    const handleAddFacility = () => {
        if (newFacility.trim()) {
            handleInputChange("facilities", [...formData.facilities, newFacility.trim()])
            setNewFacility("")
        }
    }

    const handleRemoveFacility = (index: number) => {
        const updatedFacilities = formData.facilities.filter((_, i) => i !== index)
        handleInputChange("facilities", updatedFacilities)
    }

    const handleSave = () => {
        onSave(formData)
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
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Nhập tên chi nhánh"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="manager">Quản lý</Label>
                                <Input
                                    id="manager"
                                    value={formData.manager}
                                    onChange={(e) => handleInputChange("manager", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Tên quản lý chi nhánh"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Số điện thoại liên hệ"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Email chi nhánh"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                disabled={isReadOnly}
                                placeholder="Địa chỉ chi tiết của chi nhánh"
                                rows={2}
                            />
                        </div>

                        {!isReadOnly && (
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                                />
                                <Label htmlFor="isActive">Kích hoạt chi nhánh</Label>
                            </div>
                        )}

                        {isReadOnly && (
                            <div className="flex items-center gap-4">
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
                                <Badge className={formData.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {formData.isActive ? "Đang hoạt động" : "Tạm dừng"}
                                </Badge>
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
                                    value={formData.openingHours.weekdays}
                                    onChange={(e) => handleOpeningHoursChange("weekdays", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="08:00 - 18:00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="weekend">Thứ 7 - Chủ nhật</Label>
                                <Input
                                    id="weekend"
                                    value={formData.openingHours.weekend}
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
                            Dịch vụ cung cấp ({formData?.services?.length})
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {services?.map((service) => (
                                <div key={service.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={service.id}
                                        checked={formData?.services?.includes(service.id)}
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
                            {formData?.facilities?.map((facility, index) => (
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
                    {isReadOnly && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Thống kê hoạt động</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="h-5 w-5 text-blue-600" />
                                            <span className="font-medium text-blue-900">Doanh thu tháng này</span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-700">{formatCurrency(formData.monthlyRevenue)}</p>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="h-5 w-5 text-green-600" />
                                            <span className="font-medium text-green-900">Tổng lịch hẹn</span>
                                        </div>
                                        <p className="text-2xl font-bold text-green-700">{formData.totalBookings}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {isReadOnly ? "Đóng" : "Hủy"}
                    </Button>
                    {!isReadOnly && <Button onClick={handleSave}>{mode === "create" ? "Tạo chi nhánh" : "Lưu thay đổi"}</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select"
import { Switch } from "@/components/Atoms/ui/switch"
import { Badge } from "@/components/Atoms/ui/badge"
import { Separator } from "@/components/Atoms/ui/separator"
import { Checkbox } from "@/components/Atoms/ui/checkbox"
import { Plus, Trash2, Package, MapPin, Clock, DollarSign } from "lucide-react"

interface Service {
    id: string
    name: string
    description: string
    category: string
    isActive: boolean
    basePrice: number
    duration: number
    packages: ServicePackage[]
    availableBranches: string[]
}

interface ServicePackage {
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

interface Category {
    id: string
    name: string
    color: string
}

interface ServiceModalProps {
    service: Service | null
    branches: Branch[]
    categories: Category[]
    mode: "view" | "edit" | "create"
    isOpen: boolean
    onClose: () => void
    onSave: (service: Service) => void
}

export default function ServiceModal({ service, branches, categories, mode, isOpen, onClose, onSave }: ServiceModalProps) {
    const [formData, setFormData] = useState<Service>({
        id: "",
        name: "",
        description: "",
        category: "",
        isActive: true,
        basePrice: 0,
        duration: 60,
        packages: [],
        availableBranches: [],
    })

    const [newPackage, setNewPackage] = useState<ServicePackage>({
        id: "",
        name: "",
        price: 0,
        description: "",
        features: [""],
        isActive: true,
    })

    const [isAddingPackage, setIsAddingPackage] = useState(false)

    useEffect(() => {
        if (service && (mode === "view" || mode === "edit")) {
            setFormData(service)
        } else if (mode === "create") {
            setFormData({
                id: "",
                name: "",
                description: "",
                category: "",
                isActive: true,
                basePrice: 0,
                duration: 60,
                packages: [],
                availableBranches: [],
            })
        }
    }, [service, mode])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours > 0) {
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
        }
        return `${mins}m`
    }

    const handleInputChange = (field: keyof Service, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleBranchToggle = (branchId: string) => {
        const updatedBranches = formData.availableBranches.includes(branchId)
            ? formData.availableBranches.filter((id) => id !== branchId)
            : [...formData.availableBranches, branchId]

        handleInputChange("availableBranches", updatedBranches)
    }

    const handleAddPackage = () => {
        if (newPackage.name && newPackage.price > 0) {
            const packageToAdd = {
                ...newPackage,
                id: `pkg${Date.now()}`,
                features: newPackage.features.filter((f) => f.trim() !== ""),
            }

            handleInputChange("packages", [...formData.packages, packageToAdd])
            setNewPackage({
                id: "",
                name: "",
                price: 0,
                description: "",
                features: [""],
                isActive: true,
            })
            setIsAddingPackage(false)
        }
    }

    const handleRemovePackage = (packageId: string) => {
        const updatedPackages = formData.packages.filter((pkg) => pkg.id !== packageId)
        handleInputChange("packages", updatedPackages)
    }

    const handlePackageFeatureChange = (index: number, value: string) => {
        const updatedFeatures = [...newPackage.features]
        updatedFeatures[index] = value
        setNewPackage((prev) => ({ ...prev, features: updatedFeatures }))
    }

    const addPackageFeature = () => {
        setNewPackage((prev) => ({ ...prev, features: [...prev.features, ""] }))
    }

    const removePackageFeature = (index: number) => {
        const updatedFeatures = newPackage.features.filter((_, i) => i !== index)
        setNewPackage((prev) => ({ ...prev, features: updatedFeatures }))
    }

    const handleSave = () => {
        onSave(formData)
    }

    const isReadOnly = mode === "view"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Thêm dịch vụ mới" : mode === "edit" ? "Chỉnh sửa dịch vụ" : "Chi tiết dịch vụ"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Tạo dịch vụ mới cho studio của bạn"
                            : mode === "edit"
                                ? "Cập nhật thông tin dịch vụ"
                                : "Xem chi tiết thông tin dịch vụ"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Thông tin cơ bản</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên dịch vụ</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Nhập tên dịch vụ"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Danh mục</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleInputChange("category", value)}
                                    disabled={isReadOnly}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem key={category.id} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="basePrice">Giá cơ bản</Label>
                                <Input
                                    id="basePrice"
                                    type="number"
                                    value={formData.basePrice}
                                    onChange={(e) => handleInputChange("basePrice", Number(e.target.value))}
                                    disabled={isReadOnly}
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Thời gian (phút)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange("duration", Number(e.target.value))}
                                    disabled={isReadOnly}
                                    placeholder="60"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                disabled={isReadOnly}
                                placeholder="Mô tả chi tiết về dịch vụ"
                                rows={3}
                            />
                        </div>

                        {!isReadOnly && (
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                                />
                                <Label htmlFor="isActive">Kích hoạt dịch vụ</Label>
                            </div>
                        )}

                        {isReadOnly && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <span>{formatCurrency(formData.basePrice)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span>{formatDuration(formData.duration)}</span>
                                </div>
                                <Badge className={formData.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {formData.isActive ? "Đang hoạt động" : "Tạm dừng"}
                                </Badge>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Chi nhánh */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Chi nhánh cung cấp
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {branches?.map((branch) => (
                                <div key={branch.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={branch.id}
                                        checked={formData.availableBranches.includes(branch.id)}
                                        onCheckedChange={() => handleBranchToggle(branch.id)}
                                        disabled={isReadOnly}
                                    />
                                    <Label htmlFor={branch.id} className="text-sm">
                                        {branch.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Gói dịch vụ */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Gói dịch vụ ({formData?.packages?.length})
                            </h3>
                            {!isReadOnly && (
                                <Button variant="outline" size="sm" onClick={() => setIsAddingPackage(true)} className="gap-1">
                                    <Plus className="h-4 w-4" />
                                    Thêm gói
                                </Button>
                            )}
                        </div>

                        {/* Existing packages */}
                        <div className="space-y-3">
                            {formData.packages?.map((pkg) => (
                                <div key={pkg.id} className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium">{pkg.name}</h4>
                                            <p className="text-sm text-gray-600">{pkg.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{formatCurrency(pkg.price)}</span>
                                            {!isReadOnly && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemovePackage(pkg.id)}
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        {pkg.features?.map((feature, index) => (
                                            <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add new package form */}
                        {isAddingPackage && (
                            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg space-y-4">
                                <h4 className="font-medium">Thêm gói dịch vụ mới</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tên gói</Label>
                                        <Input
                                            value={newPackage.name}
                                            onChange={(e) => setNewPackage((prev) => ({ ...prev, name: e.target.value }))}
                                            placeholder="Tên gói dịch vụ"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Giá</Label>
                                        <Input
                                            type="number"
                                            value={newPackage.price}
                                            onChange={(e) => setNewPackage((prev) => ({ ...prev, price: Number(e.target.value) }))}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Mô tả</Label>
                                    <Textarea
                                        value={newPackage.description}
                                        onChange={(e) => setNewPackage((prev) => ({ ...prev, description: e.target.value }))}
                                        placeholder="Mô tả gói dịch vụ"
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tính năng</Label>
                                    {newPackage.features?.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={feature}
                                                onChange={(e) => handlePackageFeatureChange(index, e.target.value)}
                                                placeholder="Nhập tính năng"
                                            />
                                            {newPackage.features?.length > 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removePackageFeature(index)}
                                                    className="px-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={addPackageFeature} className="gap-1">
                                        <Plus className="h-4 w-4" />
                                        Thêm tính năng
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={handleAddPackage} size="sm">
                                        Thêm gói
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setIsAddingPackage(false)}>
                                        Hủy
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {isReadOnly ? "Đóng" : "Hủy"}
                    </Button>
                    {!isReadOnly && <Button onClick={handleSave}>{mode === "create" ? "Tạo dịch vụ" : "Lưu thay đổi"}</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

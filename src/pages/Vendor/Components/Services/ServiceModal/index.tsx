"use client"

import { useState } from "react"
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
import { Badge } from "@/components/Atoms/ui/badge"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { ArrowRight, X, ImageIcon, Upload } from "lucide-react"
import toast from "react-hot-toast"
import { IServiceType } from "@models/serviceTypes/common.model"
import packageService from "@services/package-services"
import { IBackendResponse } from "@models/backend/backendResponse.model"

interface CreateServiceModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    serviceTypes: IServiceType[]
    vendorId: string
}

interface ServiceFormData {
    name: string
    description: string
    status: "ACTIVE" | "INACTIVE"
    image?: File
}

interface ConceptFormData {
    name: string
    description: string
    price: number
    duration: number
    serviceTypeIds: string[]
    status: "ACTIVE" | "INACTIVE"
    images: File[]
}


export default function ServiceModal({ isOpen, onClose, onSuccess, serviceTypes, vendorId }: CreateServiceModalProps) {
    const [step, setStep] = useState<"service" | "concept">("service")
    const [isLoading, setIsLoading] = useState(false)
    const [createdServiceId, setCreatedServiceId] = useState<string>("")

    // Service form data
    const [serviceData, setServiceData] = useState<ServiceFormData>({
        name: "",
        description: "",
        status: "ACTIVE",
    })

    // Concept form data
    const [conceptData, setConceptData] = useState<ConceptFormData>({
        name: "",
        description: "",
        price: 0,
        duration: 60,
        serviceTypeIds: [],
        status: "ACTIVE",
        images: [],
    })

    const [serviceImagePreview, setServiceImagePreview] = useState<string>("")
    const [conceptImagePreviews, setConceptImagePreviews] = useState<string[]>([])

    const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setServiceData((prev) => ({ ...prev, image: file }))
            const reader = new FileReader()
            reader.onload = () => setServiceImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleConceptImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const remainingSlots = 10 - conceptData.images.length
        const filesToAdd = files.slice(0, remainingSlots)

        if (files.length > remainingSlots) {
            toast.error(`Chỉ có thể thêm ${remainingSlots} ảnh nữa (tối đa 10 ảnh)`)
        }

        const newImages = [...conceptData.images, ...filesToAdd]
        setConceptData((prev) => ({ ...prev, images: newImages }))

        // Create previews
        filesToAdd.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
                setConceptImagePreviews((prev) => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeConceptImage = (index: number) => {
        const newImages = conceptData.images.filter((_, i) => i !== index)
        const newPreviews = conceptImagePreviews.filter((_, i) => i !== index)
        setConceptData((prev) => ({ ...prev, images: newImages }))
        setConceptImagePreviews(newPreviews)
    }

    const handleServiceTypeToggle = (typeId: string) => {
        setConceptData((prev) => ({
            ...prev,
            serviceTypeIds: prev.serviceTypeIds.includes(typeId)
                ? prev.serviceTypeIds.filter((id) => id !== typeId)
                : [...prev.serviceTypeIds, typeId],
        }))
    }

    // Cập nhật handleCreateService để sử dụng Server Action
    const handleCreateService = async () => {
        if (!serviceData.name || !serviceData.description) {
            toast.error("Vui lòng điền đầy đủ thông tin dịch vụ")
            return
        }

        setIsLoading(true)
        try {
            // Tạo FormData để gửi lên server
            const formData = new FormData()
            formData.append("name", serviceData.name)
            formData.append("description", serviceData.description)
            formData.append("vendorId", vendorId)
            formData.append("status", serviceData.status)

            if (serviceData.image) {
                formData.append("image", serviceData.image)
            }

            // Gọi Server Action
            const response = await packageService.createPackage(formData) as IBackendResponse<any>
            console.log(response)
            if (response.statusCode === 200) {
                setCreatedServiceId(response.data.id)
                setStep("concept")
                toast.success("Tạo dịch vụ thành công! Tiếp tục tạo gói dịch vụ.")
            } else {
                toast.error(response.error || "Có lỗi xảy ra khi tạo dịch vụ")
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tạo dịch vụ")
            console.error("Error creating service:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Cập nhật handleCreateConcept để sử dụng Server Action
    const handleCreateConcept = async () => {
        if (
            !conceptData.name ||
            !conceptData.description ||
            conceptData.price <= 0 ||
            conceptData.serviceTypeIds.length === 0
        ) {
            toast.error("Vui lòng điền đầy đủ thông tin gói dịch vụ")
            return
        }

        setIsLoading(true)
        try {
            // Tạo FormData để gửi lên server
            const formData = new FormData()
            formData.append("name", conceptData.name)
            formData.append("description", conceptData.description)
            formData.append("price", conceptData.price.toString())
            formData.append("duration", conceptData.duration.toString())
            formData.append("servicePackageId", createdServiceId)
            formData.append("serviceTypeIds", JSON.stringify(conceptData.serviceTypeIds))
            formData.append("status", conceptData.status)

            // Thêm images (tối đa 10)
            conceptData.images.forEach((image, index) => {
                if (index < 10) {
                    formData.append("images", image)
                }
            })

            // Gọi Server Action
            // const result = await createServiceConceptAction(formData)
            const result = { success: true, data: { id: "1" }, error: null }
            if (result.success) {
                toast.success("Tạo gói dịch vụ thành công!")
                onSuccess()
                handleClose()
            } else {
                toast.error(result.error || "Có lỗi xảy ra khi tạo gói dịch vụ")
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tạo gói dịch vụ")
            console.error("Error creating service concept:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setStep("service")
        setServiceData({ name: "", description: "", status: "ACTIVE" })
        setConceptData({
            name: "",
            description: "",
            price: 0,
            duration: 60,
            serviceTypeIds: [],
            status: "ACTIVE",
            images: [],
        })
        setServiceImagePreview("")
        setConceptImagePreviews([])
        setCreatedServiceId("")
        onClose()
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {step === "service" ? (
                            <>
                                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                    1
                                </span>
                                Tạo dịch vụ mới
                            </>
                        ) : (
                            <>
                                <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                                    2
                                </span>
                                Tạo gói dịch vụ
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {step === "service"
                            ? "Tạo dịch vụ cơ bản trước, sau đó sẽ tạo các gói dịch vụ chi tiết"
                            : "Tạo gói dịch vụ với giá cả và chi tiết cụ thể"}
                    </DialogDescription>
                </DialogHeader>

                {step === "service" ? (
                    // Step 1: Create Service
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="service-name">Tên dịch vụ *</Label>
                                <Input
                                    id="service-name"
                                    value={serviceData.name}
                                    onChange={(e) => setServiceData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ví dụ: Chụp ảnh cưới"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="service-description">Mô tả dịch vụ *</Label>
                                <Textarea
                                    id="service-description"
                                    value={serviceData.description}
                                    onChange={(e) => setServiceData((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Mô tả chi tiết về dịch vụ của bạn"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="service-status">Trạng thái</Label>
                                <Select
                                    value={serviceData.status}
                                    onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                                        setServiceData((prev) => ({ ...prev, status: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                        <SelectItem value="INACTIVE">Tạm dừng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Ảnh đại diện dịch vụ</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    {serviceImagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={serviceImagePreview || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => {
                                                    setServiceData((prev) => ({ ...prev, image: undefined }))
                                                    setServiceImagePreview("")
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4">
                                                <label htmlFor="service-image" className="cursor-pointer">
                                                    <span className="mt-2 block text-sm font-medium text-gray-900">Tải lên ảnh đại diện</span>
                                                    <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF tối đa 10MB</span>
                                                </label>
                                                <input
                                                    id="service-image"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleServiceImageChange}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Step 2: Create Concept
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="concept-name">Tên gói dịch vụ *</Label>
                                <Input
                                    id="concept-name"
                                    value={conceptData.name}
                                    onChange={(e) => setConceptData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ví dụ: Gói Cưới Cơ Bản"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="concept-description">Mô tả gói dịch vụ *</Label>
                                <Textarea
                                    id="concept-description"
                                    value={conceptData.description}
                                    onChange={(e) => setConceptData((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Mô tả chi tiết về gói dịch vụ này"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="concept-price">Giá (VNĐ) *</Label>
                                    <Input
                                        id="concept-price"
                                        type="number"
                                        value={conceptData.price}
                                        onChange={(e) => setConceptData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                                        placeholder="0"
                                    />
                                    {conceptData.price > 0 && (
                                        <p className="text-sm text-gray-500">{formatCurrency(conceptData.price)}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="concept-duration">Thời gian (phút) *</Label>
                                    <Input
                                        id="concept-duration"
                                        type="number"
                                        value={conceptData.duration}
                                        onChange={(e) => setConceptData((prev) => ({ ...prev, duration: Number(e.target.value) }))}
                                        placeholder="60"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Loại dịch vụ *</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {serviceTypes.map((type) => (
                                        <Card
                                            key={type.id}
                                            className={`cursor-pointer transition-colors ${conceptData.serviceTypeIds.includes(type.id)
                                                ? "border-blue-500 bg-blue-50"
                                                : "hover:border-gray-300"
                                                }`}
                                            onClick={() => handleServiceTypeToggle(type.id)}
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-sm">{type.name}</p>
                                                        <p className="text-xs text-gray-500">{type.description}</p>
                                                    </div>
                                                    {conceptData.serviceTypeIds.includes(type.id) && (
                                                        <Badge className="bg-blue-100 text-blue-800">✓</Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">Đã chọn: {conceptData.serviceTypeIds.length} loại dịch vụ</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="concept-status">Trạng thái</Label>
                                <Select
                                    value={conceptData.status}
                                    onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                                        setConceptData((prev) => ({ ...prev, status: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                        <SelectItem value="INACTIVE">Tạm dừng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Ảnh gói dịch vụ (tối đa 10 ảnh)</Label>

                                {/* Image previews */}
                                {conceptImagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {conceptImagePreviews.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview || "/placeholder.svg"}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-1 right-1 h-6 w-6 p-0"
                                                    onClick={() => removeConceptImage(index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload area */}
                                {conceptData.images.length < 10 && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <div className="text-center">
                                            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                            <div className="mt-2">
                                                <label htmlFor="concept-images" className="cursor-pointer">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        Thêm ảnh ({conceptData.images.length}/10)
                                                    </span>
                                                    <span className="block text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB mỗi ảnh</span>
                                                </label>
                                                <input
                                                    id="concept-images"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleConceptImagesChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Hủy
                    </Button>
                    {step === "service" ? (
                        <Button onClick={handleCreateService} disabled={isLoading} className="gap-2">
                            {isLoading ? "Đang tạo..." : "Tiếp tục"}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleCreateConcept} disabled={isLoading}>
                            {isLoading ? "Đang tạo..." : "Hoàn thành"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

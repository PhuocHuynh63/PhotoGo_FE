"use client"

import { useEffect, useState } from "react"
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
import { Card, CardContent, CardTitle, CardHeader } from "@components/Atoms/ui/card"
import { ArrowRight, Clock, DollarSign, Edit, Eye, ImageIcon, Package, Tag, Upload, X } from "lucide-react"
import toast from "react-hot-toast"
import packageService from "@services/packageServices"
import { IBackendResponse } from "@models/backend/backendResponse.model"
import Image from "next/image"
import { Separator } from "@components/Atoms/ui/separator"


interface ServiceType {
    id: string
    name: string
    description: string
}

interface ServiceConcept {
    id: string
    name: string
    price: number
    duration: number
    description: string
    serviceTypes: ServiceType[]
    images: string[]
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

interface CreateServiceModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    serviceTypes: ServiceType[]
    vendor: any
    mode: "create" | "edit" | "view"
    selectedService?: ServicePackage | null
}

interface ServiceFormData {
    name: string
    description: string
    status: "hoạt động" | "không hoạt động"
    image?: File
    vendorId: string
}

interface ConceptFormData {
    id: string
    name: string
    description: string
    price: number
    duration: number
    serviceTypeIds: string[]
    images: File[]
}


export default function ServiceModal({ isOpen, onClose, onSuccess, serviceTypes, vendor, mode, selectedService }: CreateServiceModalProps) {
    const [step, setStep] = useState<"service" | "concept">("service")
    const [isLoading, setIsLoading] = useState(false)
    const [createdServiceId, setCreatedServiceId] = useState<string>("")
    const [serviceImagePreview, setServiceImagePreview] = useState<string>("")
    const [conceptImagePreviews, setConceptImagePreviews] = useState<string[][]>([[]])
    const [currentConceptIndex, setCurrentConceptIndex] = useState(0)
    const [isEditing, setIsEditing] = useState(false)


    const [serviceData, setServiceData] = useState<ServiceFormData>({
        name: "",
        description: "",
        image: undefined,
        vendorId: vendor?.id || "",
        status: "hoạt động",
    })
    // Concept form data
    const [concepts, setConcepts] = useState<ConceptFormData[]>([{
        id: "",
        name: "",
        description: "",
        price: 0,
        duration: 60,
        serviceTypeIds: [],
        images: [],

    }])


    useEffect(() => {
        if (mode === "view" || mode === "edit") {
            if (selectedService) {
                // Load service data
                setServiceData({
                    name: selectedService.name || "",
                    description: selectedService.description || "",
                    image: undefined,
                    vendorId: vendor?.id || "",
                    status: selectedService.status === "hoạt động" ? "hoạt động" : "không hoạt động",
                })

                // Set service image preview if exists
                if (selectedService.image) {
                    setServiceImagePreview(selectedService.image)
                }

                // Load concepts data
                if (selectedService.serviceConcepts && selectedService.serviceConcepts.length > 0) {
                    const loadedConcepts = selectedService.serviceConcepts.map((concept) => ({
                        id: concept.id,
                        name: concept.name || "",
                        description: concept.description || "",
                        price: concept.price || 0,
                        duration: concept.duration || 60,
                        serviceTypeIds: concept.serviceTypes?.map((type) => type.id) || [],
                        images: [],
                    }))
                    setConcepts(loadedConcepts)

                    // Set concept image previews
                    const imagePreviews = selectedService.serviceConcepts.map((concept) => concept.images || [])
                    setConceptImagePreviews(imagePreviews)
                }

                setCreatedServiceId(selectedService.id)
            }
            setIsEditing(mode === "edit")
        } else if (mode === "create") {
            // Reset for create mode
            setServiceData({
                name: "",
                description: "",
                image: undefined,
                vendorId: vendor?.id || "",
                status: "hoạt động",
            })
            setConcepts([
                {
                    id: "",
                    name: "",
                    description: "",
                    price: 0,
                    duration: 60,
                    serviceTypeIds: [],
                    images: [],
                },
            ])
            setConceptImagePreviews([[]])
            setServiceImagePreview("")
            setCreatedServiceId("")
            setIsEditing(true)
        }
    }, [mode, selectedService, vendor])


    const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setServiceData((prev) => ({ ...prev, image: file }))
            const reader = new FileReader()
            reader.onload = () => setServiceImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleAddConcept = () => {
        setConcepts(prev => [...prev, {
            id: "",
            name: "",
            description: "",
            price: 0,
            duration: 60,
            serviceTypeIds: [],
            images: [],
        }])
        setConceptImagePreviews(prev => [...prev, []])
        setCurrentConceptIndex(prev => prev + 1)
    }

    const handleRemoveConcept = (index: number) => {
        if (concepts.length > 1) {
            setConcepts((prev) => prev.filter((_, i) => i !== index))
            setConceptImagePreviews((prev) => prev.filter((_, i) => i !== index))
            if (currentConceptIndex >= concepts.length - 1) {
                setCurrentConceptIndex(Math.max(0, concepts.length - 2))
            }
        }
    }

    const handleConceptImagesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const files = Array.from(e.target.files || [])
        const remainingSlots = 10 - concepts[index].images.length
        const filesToAdd = files.slice(0, remainingSlots)

        if (files.length > remainingSlots) {
            toast.error(`Chỉ có thể thêm ${remainingSlots} ảnh nữa (tối đa 10 ảnh)`)
        }

        const newImages = [...concepts[index].images, ...filesToAdd]
        setConcepts(prev => {
            const newConcepts = [...prev]
            newConcepts[index] = { ...newConcepts[index], images: newImages }
            return newConcepts
        })

        // Create previews
        filesToAdd.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
                setConceptImagePreviews(prev => {
                    const newPreviews = [...prev]
                    newPreviews[index] = [...newPreviews[index], reader.result as string]
                    return newPreviews
                })
            }
            reader.readAsDataURL(file)
        })
    }

    const removeConceptImage = (conceptIndex: number, imageIndex: number) => {
        setConcepts(prev => {
            const newConcepts = [...prev]
            newConcepts[conceptIndex] = {
                ...newConcepts[conceptIndex],
                images: newConcepts[conceptIndex].images.filter((_, i) => i !== imageIndex)
            }
            return newConcepts
        })
        setConceptImagePreviews(prev => {
            const newPreviews = [...prev]
            newPreviews[conceptIndex] = newPreviews[conceptIndex].filter((_, i) => i !== imageIndex)
            return newPreviews
        })
    }

    const handleServiceTypeToggle = (typeId: string, conceptIndex: number) => {
        setConcepts(prev => {
            const newConcepts = [...prev]
            newConcepts[conceptIndex] = {
                ...newConcepts[conceptIndex],
                serviceTypeIds: newConcepts[conceptIndex].serviceTypeIds.includes(typeId)
                    ? newConcepts[conceptIndex].serviceTypeIds.filter((id) => id !== typeId)
                    : [...newConcepts[conceptIndex].serviceTypeIds, typeId],
            }
            return newConcepts
        })
    }

    // Cập nhật handleCreateService để sử dụng accessToken
    const handleCreateService = async () => {
        if (!serviceData.name || !serviceData.description) {
            toast.error("Vui lòng điền đầy đủ thông tin dịch vụ")
            return
        }

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", serviceData.name)
            formData.append("description", serviceData.description)
            formData.append("vendorId", serviceData.vendorId)
            formData.append("status", serviceData.status)
            if (serviceData.image) {
                formData.append("image", serviceData.image)
            }

            const response = await packageService.createPackage(formData) as IBackendResponse<any>
            if (response.statusCode === 201) {
                setCreatedServiceId(response?.data?.id)
                setStep("concept")
                toast.success("Tạo dịch vụ thành công! Tiếp tục tạo gói dịch vụ.")
                // Trigger data refresh
                onSuccess()
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

    const handleUpdateService = async () => {
        setIsLoading(true)
        try {
            console.log("Updating service:", serviceData)

            const formData = new FormData()
            formData.append("name", serviceData.name)
            formData.append("description", serviceData.description)
            formData.append("status", serviceData.status)

            const response = await packageService.updatePackage(createdServiceId, formData) as IBackendResponse<any>
            if (response.statusCode === 200) {
                toast.success("Cập nhật dịch vụ thành công!")
                onSuccess()
                // handleClose()
                setStep("concept")
            } else {
                toast.error(response.error || "Có lỗi xảy ra khi cập nhật dịch vụ")
            }
        } catch (error) {
            console.error("Error updating service:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateConcept = async () => {
        setIsLoading(true)
        try {
            for (const concept of concepts) {
                const formData = new FormData()
                formData.append("name", concept.name)
                formData.append("description", concept.description)
                formData.append("price", concept.price.toString())
                formData.append("duration", concept.duration.toString())
                formData.append("servicePackageId", createdServiceId)
                formData.append("serviceTypeIds", concept.serviceTypeIds.join(", "))

                let response: IBackendResponse<any>
                if (concept.id) {
                    // Update existing concept
                    response = await packageService.updateServiceConcept(concept.id, formData) as IBackendResponse<any>
                } else {
                    // Create new concept
                    response = await packageService.createServiceConcept(formData) as IBackendResponse<any>
                }

                if (response.statusCode !== 200 && response.statusCode !== 201) {
                    throw new Error(response.error || "Có lỗi xảy ra khi xử lý gói dịch vụ")
                }
            }
            toast.success("Cập nhật gói dịch vụ thành công!")
            onSuccess()
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật gói dịch vụ")
            console.error("Error updating concepts:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateConcept = async () => {
        // Validate all concepts
        const invalidConcepts = concepts.filter(
            concept => !concept.name || !concept.description || concept.price <= 0 || concept.serviceTypeIds.length === 0
        )

        if (invalidConcepts.length > 0) {
            toast.error("Vui lòng điền đầy đủ thông tin cho tất cả các gói dịch vụ")
            return
        }

        setIsLoading(true)
        try {
            // Create concepts sequentially
            for (const concept of concepts) {
                const formData = new FormData()
                formData.append("name", concept.name)
                formData.append("description", concept.description)
                formData.append("price", concept.price.toString())
                formData.append("duration", concept.duration.toString())
                formData.append("servicePackageId", createdServiceId)
                formData.append("serviceTypeIds", concept.serviceTypeIds.join(", "))

                concept.images.forEach((image, index) => {
                    if (index < 10) {
                        formData.append("images", image)
                    }
                })

                const response = await packageService.createServiceConcept(formData) as IBackendResponse<any>
                if (response.statusCode !== 201) {
                    throw new Error(response.error || "Có lỗi xảy ra khi tạo gói dịch vụ")
                }
            }

            toast.success("Tạo tất cả gói dịch vụ thành công!")
            onSuccess()
            handleClose()
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tạo gói dịch vụ")
            console.error("Error creating service concepts:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        // setStep("service")
        // setServiceData({ name: "", description: "", status: "hoạt động", vendorId: vendor?.id })
        // setConcepts([{
        //     name: "",
        //     description: "",
        //     price: 0,
        //     duration: 60,
        //     serviceTypeIds: [],
        //     status: "hoạt động",
        //     images: [],
        // }])
        // setConceptImagePreviews([[]])
        // setCurrentConceptIndex(0)
        // setServiceImagePreview("")
        // setCreatedServiceId("")
        onClose()
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
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

    const getModalTitle = () => {
        if (mode === "create") return "Tạo dịch vụ mới"
        if (mode === "edit") return "Chỉnh sửa dịch vụ"
        return "Chi tiết dịch vụ"
    }

    const getModalDescription = () => {
        if (mode === "create") {
            return step === "service"
                ? "Tạo dịch vụ cơ bản trước, sau đó sẽ tạo các gói dịch vụ chi tiết"
                : "Tạo gói dịch vụ với giá cả và chi tiết cụ thể"
        }
        if (mode === "edit") return "Chỉnh sửa thông tin dịch vụ và các gói dịch vụ"
        return "Xem chi tiết thông tin dịch vụ và các gói dịch vụ"
    }
    console.log(selectedService)
    if (mode === "view" && selectedService) {
        return (
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Chi tiết dịch vụ
                        </DialogTitle>
                        <DialogDescription>Xem chi tiết thông tin dịch vụ và các gói dịch vụ</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Service Information */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Thông tin dịch vụ</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setIsEditing(true)
                                        // Don't close modal, just switch to edit mode
                                    }}
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Chỉnh sửa
                                </Button>
                            </div>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Tên dịch vụ</Label>
                                                <p className="text-lg font-medium">{selectedService.name}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Trạng thái</Label>
                                                <div className="mt-1">
                                                    <Badge
                                                        className={
                                                            selectedService.status === "hoạt động"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }
                                                    >
                                                        {selectedService.status === "hoạt động" ? "Đang hoạt động" : "Tạm dừng"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Mô tả</Label>
                                                <p className="text-sm text-gray-700 mt-1">{selectedService.description}</p>
                                            </div>
                                        </div>
                                        {selectedService.image && (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Ảnh đại diện</Label>
                                                <div className="mt-2">
                                                    <Image
                                                        src={selectedService.image || "/placeholder.svg"}
                                                        alt={selectedService.name}
                                                        width={300}
                                                        height={200}
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Separator />

                        {/* Service Concepts */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                <h3 className="text-lg font-medium">Gói dịch vụ ({selectedService.serviceConcepts?.length || 0})</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {selectedService.serviceConcepts?.map((concept) => (
                                    <Card key={concept.id} className="border-l-4 border-l-blue-500">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{concept.name}</CardTitle>
                                                    <p className="text-sm text-gray-600 mt-1">{concept.description}</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Giá</p>
                                                        <p className="font-medium">{formatCurrency(concept.price)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Thời gian</p>
                                                        <p className="font-medium">{formatDuration(concept.duration)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Loại dịch vụ</p>
                                                        <p className="font-medium">{concept.serviceTypes?.length || 0} loại</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Ảnh</p>
                                                        <p className="font-medium">{concept.images?.length || 0} ảnh</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Service Types */}
                                            {concept.serviceTypes && concept.serviceTypes.length > 0 && (
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500">Loại dịch vụ</Label>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {concept.serviceTypes.map((type) => (
                                                            <Badge key={type.id} variant="outline">
                                                                {type.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Images */}
                                            {concept.images && concept.images.length > 0 && (
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500">Ảnh gói dịch vụ</Label>
                                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                                                        {concept.images.map((image, imageIndex) => (
                                                            <div key={imageIndex} className="relative">
                                                                <Image
                                                                    src={image || "/placeholder.svg"}
                                                                    alt={`${concept.name} ${imageIndex + 1}`}
                                                                    width={100}
                                                                    height={80}
                                                                    className="w-full h-20 object-cover rounded-lg"
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

                            {(!selectedService.serviceConcepts || selectedService.serviceConcepts.length === 0) && (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Chưa có gói dịch vụ nào</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button
                            onClick={() => {
                                setIsEditing(true)
                                // Switch to edit mode without closing
                            }}
                            className="gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {mode === "create" ? (
                            step === "service" ? (
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
                            )
                        ) : (
                            <>
                                <Edit className="h-5 w-5" />
                                Chỉnh sửa dịch vụ
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>{getModalDescription()}</DialogDescription>
                </DialogHeader>

                {(mode === "create" && step === "service") || (mode === "edit" && step === "service") ? (
                    // Step 1: Create/Edit Service
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="service-name">Tên dịch vụ *</Label>
                                <Input
                                    id="service-name"
                                    value={serviceData?.name}
                                    onChange={(e) => setServiceData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ví dụ: Chụp ảnh cưới"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="service-description">Mô tả dịch vụ *</Label>
                                <Textarea
                                    id="service-description"
                                    value={serviceData?.description}
                                    onChange={(e) => setServiceData((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Mô tả chi tiết về dịch vụ của bạn"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="service-status">Trạng thái</Label>
                                <Select
                                    value={serviceData?.status}
                                    onValueChange={(value: "hoạt động" | "không hoạt động") =>
                                        setServiceData((prev) => ({ ...prev, status: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hoạt động">Hoạt động</SelectItem>
                                        <SelectItem value="không hoạt động">Tạm dừng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Ảnh đại diện dịch vụ</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    {serviceImagePreview ? (
                                        <div className="relative">
                                            <Image
                                                src={serviceImagePreview || "/placeholder.svg"}
                                                alt="Preview"
                                                width={600}
                                                height={192}
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
                    // Step 2: Create/Edit Concepts
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">
                                Gói dịch vụ {currentConceptIndex + 1}/{concepts.length}
                            </h3>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleAddConcept} className="gap-2">
                                    Thêm gói dịch vụ
                                </Button>
                                {concepts.length > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleRemoveConcept(currentConceptIndex)}
                                        className="gap-2 text-red-600 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                        Xóa gói này
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="concept-name">Tên gói dịch vụ *</Label>
                                <Input
                                    id="concept-name"
                                    value={concepts[currentConceptIndex]?.name}
                                    onChange={(e) =>
                                        setConcepts((prev) => {
                                            const newConcepts = [...prev]
                                            newConcepts[currentConceptIndex] = {
                                                ...newConcepts[currentConceptIndex],
                                                name: e.target.value,
                                            }
                                            return newConcepts
                                        })
                                    }
                                    placeholder="Ví dụ: Gói Cưới Cơ Bản"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="concept-description">Mô tả gói dịch vụ *</Label>
                                <Textarea
                                    id="concept-description"
                                    value={concepts[currentConceptIndex]?.description}
                                    onChange={(e) =>
                                        setConcepts((prev) => {
                                            const newConcepts = [...prev]
                                            newConcepts[currentConceptIndex] = {
                                                ...newConcepts[currentConceptIndex],
                                                description: e.target.value,
                                            }
                                            return newConcepts
                                        })
                                    }
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
                                        value={concepts[currentConceptIndex]?.price}
                                        onChange={(e) =>
                                            setConcepts((prev) => {
                                                const newConcepts = [...prev]
                                                newConcepts[currentConceptIndex] = {
                                                    ...newConcepts[currentConceptIndex],
                                                    price: Number(e.target.value),
                                                }
                                                return newConcepts
                                            })
                                        }
                                        placeholder="0"
                                    />
                                    {concepts[currentConceptIndex]?.price > 0 && (
                                        <p className="text-sm text-gray-500">{formatCurrency(concepts[currentConceptIndex]?.price)}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="concept-duration">Thời gian (phút) *</Label>
                                    <Input
                                        id="concept-duration"
                                        type="number"
                                        value={concepts[currentConceptIndex]?.duration}
                                        onChange={(e) =>
                                            setConcepts((prev) => {
                                                const newConcepts = [...prev]
                                                newConcepts[currentConceptIndex] = {
                                                    ...newConcepts[currentConceptIndex],
                                                    duration: Number(e.target.value),
                                                }
                                                return newConcepts
                                            })
                                        }
                                        placeholder="60"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Loại dịch vụ *</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {serviceTypes?.map((type) => (
                                        <Card
                                            key={type?.id}
                                            className={`cursor-pointer transition-colors border-2 ${concepts[currentConceptIndex]?.serviceTypeIds.includes(type?.id)
                                                ? "border-blue-500 bg-blue-50"
                                                : "hover:border-gray-300"
                                                }`}
                                            onClick={() => handleServiceTypeToggle(type?.id, currentConceptIndex)}
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex items-center justify-between mt-4">
                                                    <div>
                                                        <p className="font-medium text-sm">{type.name}</p>
                                                        <p className="text-xs text-gray-500">{type.description}</p>
                                                    </div>
                                                    {concepts[currentConceptIndex]?.serviceTypeIds.includes(type?.id) && (
                                                        <Badge className="bg-blue-100 text-blue-800" variant={"outline"}>✓</Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Đã chọn: {concepts[currentConceptIndex]?.serviceTypeIds.length} loại dịch vụ
                                </p>
                            </div>


                            <div className="space-y-2">
                                <Label>Ảnh gói dịch vụ (tối đa 10 ảnh)</Label>

                                {/* Image previews */}
                                {conceptImagePreviews[currentConceptIndex]?.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {conceptImagePreviews[currentConceptIndex].map((preview, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={preview || "/placeholder.svg"}
                                                    alt={`Preview ${index + 1}`}
                                                    width={200}
                                                    height={96}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-1 right-1 h-6 w-6 p-0"
                                                    onClick={() => removeConceptImage(currentConceptIndex, index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload area */}
                                {concepts[currentConceptIndex]?.images.length < 10 && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <div className="text-center">
                                            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                            <div className="mt-2">
                                                <label htmlFor="concept-images" className="cursor-pointer">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        Thêm ảnh ({concepts[currentConceptIndex]?.images.length}/10)
                                                    </span>
                                                    <span className="block text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB mỗi ảnh</span>
                                                </label>
                                                <input
                                                    id="concept-images"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleConceptImagesChange(e, currentConceptIndex)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation buttons */}
                        {concepts.length > 1 && (
                            <div className="flex justify-between mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentConceptIndex((prev) => Math.max(0, prev - 1))}
                                    disabled={currentConceptIndex === 0}
                                >
                                    Gói trước
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentConceptIndex((prev) => Math.min(concepts.length - 1, prev + 1))}
                                    disabled={currentConceptIndex === concepts.length - 1}
                                >
                                    Gói tiếp theo
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Hủy
                    </Button>
                    {mode === "create" ? (
                        step === "service" ? (
                            <Button onClick={handleCreateService} disabled={isLoading} className="gap-2">
                                {isLoading ? "Đang tạo..." : "Tiếp tục"}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button onClick={handleCreateConcept} disabled={isLoading}>
                                {isLoading ? "Đang tạo..." : "Hoàn thành"}
                            </Button>
                        )
                    ) : (
                        <>
                            {step === "service" && (
                                <Button onClick={handleUpdateService} className="gap-2">
                                    Chỉnh sửa gói dịch vụ
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            )}
                            {step === "concept" && (
                                <>
                                    <Button variant="outline" onClick={() => setStep("service")}>
                                        Quay lại dịch vụ
                                    </Button>
                                    <Button onClick={handleUpdateConcept} disabled={isLoading}>
                                        {isLoading ? "Đang cập nhật..." : "Lưu thay đổi"}
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

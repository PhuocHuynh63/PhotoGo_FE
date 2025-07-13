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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select"
import { Switch } from "@/components/Atoms/ui/switch"
import { Badge } from "@/components/Atoms/ui/badge"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Atoms/Accordion"
import { ArrowRight, ImageIcon, Upload, X } from "lucide-react"
import toast from "react-hot-toast"
import packageService from "@services/packageServices"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import TipTapEditor from "@components/Organisms/TipTapEditor"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"

// Types
interface ServiceType {
    id: string
    name: string
    description: string
}

interface CreateServiceModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    serviceTypes: ServiceType[]
    vendor: { id: string }
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
    conceptRangeType: "một ngày" | "nhiều ngày"
    numberOfDays: number
    serviceTypeIds: string[]
    images: File[]
}

interface ApiResponse<T> {
    statusCode: number
    data?: T
    error?: string
}

// Custom Hooks
const useServiceForm = (vendorId: string) => {
    const [serviceData, setServiceData] = useState<ServiceFormData>({
        name: "",
        description: "",
        image: undefined,
        vendorId: vendorId || "",
        status: "hoạt động",
    })
    const [serviceImagePreview, setServiceImagePreview] = useState<string>("")

    const { getRootProps: getServiceImageRootProps, getInputProps: getServiceImageInputProps } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxSize: 10 * 1024 * 1024,
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]
                setServiceData((prev) => ({ ...prev, image: file }))
                const reader = new FileReader()
                reader.onload = () => setServiceImagePreview(reader.result as string)
                reader.readAsDataURL(file)
            }
        }
    })

    return {
        serviceData,
        setServiceData,
        serviceImagePreview,
        setServiceImagePreview,
        getServiceImageRootProps,
        getServiceImageInputProps
    }
}

const useConceptForm = () => {
    const [concepts, setConcepts] = useState<ConceptFormData[]>([{
        id: "",
        name: "",
        description: "",
        price: 0,
        duration: 60,
        conceptRangeType: "một ngày",
        numberOfDays: 1,
        serviceTypeIds: [],
        images: [],
    }])
    const [conceptImagePreviews, setConceptImagePreviews] = useState<string[][]>([[]])
    const [currentConceptIndex, setCurrentConceptIndex] = useState(0)

    const { getRootProps: getConceptImagesRootProps, getInputProps: getConceptImagesInputProps } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxSize: 10 * 1024 * 1024,
        multiple: true,
        onDrop: (acceptedFiles) => {
            const currentConcept = concepts[currentConceptIndex]
            const remainingSlots = 10 - currentConcept.images.length
            const filesToAdd = acceptedFiles.slice(0, remainingSlots)

            if (acceptedFiles.length > remainingSlots) {
                toast.error(`Chỉ có thể thêm ${remainingSlots} ảnh nữa (tối đa 10 ảnh)`)
            }

            const newImages = [...currentConcept.images, ...filesToAdd]
            setConcepts(prev => {
                const newConcepts = [...prev]
                newConcepts[currentConceptIndex] = { ...newConcepts[currentConceptIndex], images: newImages }
                return newConcepts
            })

            filesToAdd.forEach((file) => {
                const reader = new FileReader()
                reader.onload = () => {
                    setConceptImagePreviews(prev => {
                        const newPreviews = [...prev]
                        newPreviews[currentConceptIndex] = [...newPreviews[currentConceptIndex], reader.result as string]
                        return newPreviews
                    })
                }
                reader.readAsDataURL(file)
            })
        }
    })

    const handleAddConcept = () => {
        setConcepts(prev => [...prev, {
            id: "",
            name: "",
            description: "",
            price: 0,
            duration: 60,
            conceptRangeType: "một ngày",
            numberOfDays: 1,
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

    return {
        concepts,
        setConcepts,
        conceptImagePreviews,
        currentConceptIndex,
        setCurrentConceptIndex,
        getConceptImagesRootProps,
        getConceptImagesInputProps,
        handleAddConcept,
        handleRemoveConcept,
        handleServiceTypeToggle,
        removeConceptImage
    }
}

// Component Props Types
interface ServiceFormProps {
    serviceData: ServiceFormData
    setServiceData: (data: ServiceFormData | ((prev: ServiceFormData) => ServiceFormData)) => void
    serviceImagePreview: string
    setServiceImagePreview: (preview: string) => void
    getServiceImageRootProps: () => React.HTMLAttributes<HTMLDivElement>
    getServiceImageInputProps: () => React.InputHTMLAttributes<HTMLInputElement>
}

interface ConceptFormProps {
    concepts: ConceptFormData[]
    setConcepts: (concepts: ConceptFormData[] | ((prev: ConceptFormData[]) => ConceptFormData[])) => void
    conceptImagePreviews: string[][]
    currentConceptIndex: number
    setCurrentConceptIndex: (index: number | ((prev: number) => number)) => void
    serviceTypes: ServiceType[]
    getConceptImagesRootProps: () => React.HTMLAttributes<HTMLDivElement>
    getConceptImagesInputProps: () => React.InputHTMLAttributes<HTMLInputElement>
    handleAddConcept: () => void
    handleRemoveConcept: (index: number) => void
    handleServiceTypeToggle: (typeId: string, conceptIndex: number) => void
    removeConceptImage: (conceptIndex: number, imageIndex: number) => void
}

// Components
const ServiceForm = ({
    serviceData,
    setServiceData,
    serviceImagePreview,
    setServiceImagePreview,
    getServiceImageRootProps,
    getServiceImageInputProps
}: ServiceFormProps) => (
    <div className="space-y-6">
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="service-name" className="text-xl font-semibold text-gray-900">
                    📝 Tên dịch vụ <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="service-name"
                    value={serviceData?.name}
                    onChange={(e) => setServiceData((prev: ServiceFormData) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ví dụ: Chụp ảnh cưới"
                    className="border-2 focus:border-blue-500"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="service-description" className="text-xl font-semibold text-gray-900">
                    📄 Mô tả dịch vụ <span className="text-red-500">*</span>
                </Label>
                <TipTapEditor
                    value={serviceData?.description}
                    onChange={(value) => setServiceData((prev: ServiceFormData) => ({ ...prev, description: value }))}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="service-status" className="text-xl font-semibold text-gray-900">
                    🚦 Trạng thái
                </Label>
                <Select
                    value={serviceData?.status}
                    onValueChange={(value: "hoạt động" | "không hoạt động") =>
                        setServiceData((prev: ServiceFormData) => ({ ...prev, status: value }))
                    }
                >
                    <SelectTrigger className="border-2 focus:border-blue-500">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hoạt động" className="text-green-700">
                            ✅ Hoạt động
                        </SelectItem>
                        <SelectItem value="không hoạt động" className="text-red-700">
                            ⏸️ Tạm dừng
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-xl font-semibold text-gray-900">
                    📸 Ảnh đại diện dịch vụ
                </Label>
                <div {...getServiceImageRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                    {serviceImagePreview ? (
                        <div className="relative">
                            <Image
                                src={serviceImagePreview || "/placeholder.svg"}
                                alt="Preview"
                                width={600}
                                height={192}
                                className="w-full h-48 object-cover rounded-lg border shadow-sm"
                            />
                            <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setServiceData((prev: ServiceFormData) => ({ ...prev, image: undefined }))
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
                                <p className="mt-2 block text-sm font-medium text-gray-900">Kéo thả ảnh vào đây hoặc click để chọn</p>
                                <p className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                            </div>
                            <input {...getServiceImageInputProps()} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
)

const ConceptForm = ({
    concepts,
    setConcepts,
    conceptImagePreviews,
    currentConceptIndex,
    setCurrentConceptIndex,
    serviceTypes,
    getConceptImagesRootProps,
    getConceptImagesInputProps,
    handleAddConcept,
    handleRemoveConcept,
    handleServiceTypeToggle,
    removeConceptImage
}: ConceptFormProps) => {

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-blue-900">
                        📦 Gói dịch vụ {currentConceptIndex + 1}/{concepts.length}
                    </h3>
                    <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                        {concepts.length} gói
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleAddConcept}
                        className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                        ➕ Thêm gói dịch vụ
                    </Button>
                    {concepts.length > 1 && (
                        <Button
                            variant="outline"
                            onClick={() => handleRemoveConcept(currentConceptIndex)}
                            className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                        >
                            🗑️ Xóa gói này
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="concept-name" className="text-xl font-semibold text-gray-900">
                        🏷️ Tên gói dịch vụ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="concept-name"
                        value={concepts[currentConceptIndex]?.name}
                        onChange={(e) =>
                            setConcepts((prev: ConceptFormData[]) => {
                                const newConcepts = [...prev]
                                newConcepts[currentConceptIndex] = {
                                    ...newConcepts[currentConceptIndex],
                                    name: e.target.value,
                                }
                                return newConcepts
                            })
                        }
                        placeholder="Ví dụ: Gói Cưới Cơ Bản"
                        className="border-2 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="concept-description" className="text-xl font-semibold text-gray-900">
                        📋 Mô tả gói dịch vụ <span className="text-red-500">*</span>
                    </Label>
                    <TipTapEditor
                        value={concepts[currentConceptIndex]?.description}
                        onChange={(value) =>
                            setConcepts((prev: ConceptFormData[]) => {
                                const newConcepts = [...prev]
                                newConcepts[currentConceptIndex] = {
                                    ...newConcepts[currentConceptIndex],
                                    description: value,
                                }
                                return newConcepts
                            })
                        }
                        placeholder="Mô tả chi tiết về gói dịch vụ này"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="concept-range-type" className="text-xl font-semibold text-gray-900">
                        📅 Loại phạm vi concept <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                                📅 Một ngày
                            </span>
                            <Switch
                                id="concept-range-type"
                                checked={concepts[currentConceptIndex]?.conceptRangeType === "nhiều ngày"}
                                onCheckedChange={(checked) => {
                                    const value = checked ? "nhiều ngày" : "một ngày";
                                    setConcepts((prev: ConceptFormData[]) => {
                                        const newConcepts = [...prev]
                                        newConcepts[currentConceptIndex] = {
                                            ...newConcepts[currentConceptIndex],
                                            conceptRangeType: value,
                                        }
                                        return newConcepts
                                    })
                                    // Auto-update related fields based on concept range type
                                    if (value === "một ngày") {
                                        setConcepts((prev: ConceptFormData[]) => {
                                            const newConcepts = [...prev]
                                            newConcepts[currentConceptIndex] = {
                                                ...newConcepts[currentConceptIndex],
                                                numberOfDays: 1,
                                                duration: newConcepts[currentConceptIndex].duration === 0 ? 60 : newConcepts[currentConceptIndex].duration,
                                            }
                                            return newConcepts
                                        })
                                    } else {
                                        setConcepts((prev: ConceptFormData[]) => {
                                            const newConcepts = [...prev]
                                            newConcepts[currentConceptIndex] = {
                                                ...newConcepts[currentConceptIndex],
                                                duration: 0,
                                                numberOfDays: newConcepts[currentConceptIndex].numberOfDays < 2 ? 2 : newConcepts[currentConceptIndex].numberOfDays,
                                            }
                                            return newConcepts
                                        })
                                    }
                                }}
                            />
                            <span className="text-sm font-medium text-gray-700">
                                📅 Nhiều ngày
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600">
                                {concepts[currentConceptIndex]?.conceptRangeType === "một ngày" 
                                    ? "Concept thực hiện trong 1 ngày" 
                                    : "Concept thực hiện trong nhiều ngày"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="concept-price" className="text-xl font-semibold text-gray-900">
                            💰 Giá (VNĐ) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="concept-price"
                            type="number"
                            value={concepts[currentConceptIndex]?.price}
                            onChange={(e) => {
                                setConcepts((prev: ConceptFormData[]) => {
                                    const newConcepts = [...prev]
                                    newConcepts[currentConceptIndex] = {
                                        ...newConcepts[currentConceptIndex],
                                        price: Number(e.target.value),
                                    }
                                    return newConcepts
                                })
                            }}
                            placeholder="0"
                            className="border-2 focus:border-blue-500"
                        />
                        {concepts[currentConceptIndex]?.price > 0 && (
                            <div className="flex flex-col items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-gray-700">
                                    <span className="font-bold">
                                        {concepts[currentConceptIndex]?.price
                                            ? formatPrice(concepts[currentConceptIndex]?.price || 0)
                                            : formatPrice(
                                                concepts[currentConceptIndex]?.price
                                            )
                                        }
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600">*Giá trên đã bao gồm thuế 5% VAT và 30% hoa hồng</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="concept-duration" className="text-xl font-semibold text-gray-900">
                            ⏱️ Thời gian (phút) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="concept-duration"
                            type="number"
                            value={concepts[currentConceptIndex]?.duration}
                            onChange={(e) =>
                                setConcepts((prev: ConceptFormData[]) => {
                                    const newConcepts = [...prev]
                                    newConcepts[currentConceptIndex] = {
                                        ...newConcepts[currentConceptIndex],
                                        duration: Number(e.target.value),
                                    }
                                    return newConcepts
                                })
                            }
                            disabled={concepts[currentConceptIndex]?.conceptRangeType === "nhiều ngày"}
                            placeholder={concepts[currentConceptIndex]?.conceptRangeType === "nhiều ngày" ? "0 (Tự động)" : "Nhập thời gian (phút)"}
                            className="border-2 focus:border-blue-500"
                        />
                        {concepts[currentConceptIndex]?.conceptRangeType === "nhiều ngày" && (
                            <p className="text-sm text-gray-500">
                                💡 Thời gian được đặt = 0 cho dịch vụ nhiều ngày
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="concept-numberOfDays" className="text-xl font-semibold text-gray-900">
                            📅 Số ngày thực hiện <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="concept-numberOfDays"
                            type="number"
                            value={concepts[currentConceptIndex]?.numberOfDays}
                            onChange={(e) =>
                                setConcepts((prev: ConceptFormData[]) => {
                                    const newConcepts = [...prev]
                                    newConcepts[currentConceptIndex] = {
                                        ...newConcepts[currentConceptIndex],
                                        numberOfDays: Number(e.target.value),
                                    }
                                    return newConcepts
                                })
                            }
                            min={concepts[currentConceptIndex]?.conceptRangeType === "một ngày" ? 1 : 2}
                            max={concepts[currentConceptIndex]?.conceptRangeType === "một ngày" ? 1 : undefined}
                            disabled={concepts[currentConceptIndex]?.conceptRangeType === "một ngày"}
                            placeholder={concepts[currentConceptIndex]?.conceptRangeType === "một ngày" ? "1 (Tự động)" : "Nhập số ngày"}
                            className="border-2 focus:border-blue-500"
                        />
                        {concepts[currentConceptIndex]?.conceptRangeType === "một ngày" && (
                            <p className="text-sm text-gray-500">
                                💡 Số ngày được đặt = 1 cho dịch vụ một ngày
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="service-types" className="border-2 border-gray-200 rounded-lg">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline cursor-pointer">
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-lg font-semibold text-gray-900">
                                        📋 Chọn loại dịch vụ ({concepts[currentConceptIndex]?.serviceTypeIds.length}/{serviceTypes?.length})
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                            {concepts[currentConceptIndex]?.serviceTypeIds.length} đã chọn
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {serviceTypes?.map((type: ServiceType) => (
                                        <Card
                                            key={type?.id}
                                            className={`cursor-pointer transition-all duration-200 border-2 ${concepts[currentConceptIndex]?.serviceTypeIds.includes(type?.id)
                                                ? "border-blue-500 bg-blue-50 shadow-md"
                                                : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                                                }`}
                                            onClick={() => handleServiceTypeToggle(type?.id, currentConceptIndex)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${concepts[currentConceptIndex]?.serviceTypeIds.includes(type?.id)
                                                                ? "border-blue-500 bg-blue-500"
                                                                : "border-gray-300"
                                                                }`}>
                                                                {concepts[currentConceptIndex]?.serviceTypeIds.includes(type?.id) && (
                                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{type.name}</p>
                                                                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {concepts[currentConceptIndex]?.serviceTypeIds.includes(type?.id) && (
                                                        <Badge className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">
                                                            ✓
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-blue-700">📊 Tổng quan:</span>
                                            <span className="text-sm font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
                                                {concepts[currentConceptIndex]?.serviceTypeIds.length} / {serviceTypes?.length} loại dịch vụ
                                            </span>
                                        </div>
                                        {concepts[currentConceptIndex]?.serviceTypeIds.length === 0 && (
                                            <span className="text-sm text-red-600 font-medium">
                                                ⚠️ Vui lòng chọn ít nhất 1 loại dịch vụ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div className="space-y-2">
                    <Label className="text-xl font-semibold text-gray-900">
                        🖼️ Ảnh gói dịch vụ <span className="text-sm text-gray-600">(tối đa 10 ảnh)</span>
                    </Label>

                    {conceptImagePreviews[currentConceptIndex]?.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                            {conceptImagePreviews[currentConceptIndex].map((preview: string, index: number) => (
                                <div key={index} className="relative group">
                                    <Image
                                        src={preview || "/placeholder.svg"}
                                        alt={`Preview ${index + 1}`}
                                        width={200}
                                        height={96}
                                        className="w-full h-24 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                                    />
                                    <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                                        {index + 1}
                                    </div>
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

                    {concepts[currentConceptIndex]?.images.length < 10 && (
                        <div {...getConceptImagesRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                            <div className="text-center">
                                <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-900">
                                        Kéo thả ảnh vào đây hoặc click để chọn ({concepts[currentConceptIndex]?.images.length}/10)
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB mỗi ảnh</p>
                                </div>
                                <input {...getConceptImagesInputProps()} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {concepts.length > 1 && (
                <div className="flex justify-between items-center mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentConceptIndex((prev: number) => Math.max(0, prev - 1))}
                            disabled={currentConceptIndex === 0}
                            className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                            ⬅️ Gói trước
                        </Button>
                        <span className="text-sm font-medium text-green-800 bg-green-100 px-3 py-1 rounded-full">
                            📍 Gói {currentConceptIndex + 1} / {concepts.length}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentConceptIndex((prev: number) => Math.min(concepts.length - 1, prev + 1))}
                            disabled={currentConceptIndex === concepts.length - 1}
                            className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                            Gói tiếp theo ➡️
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Main Component
export default function ServiceModal({ isOpen, onClose, onSuccess, serviceTypes, vendor }: CreateServiceModalProps) {
    const [step, setStep] = useState<"service" | "concept">("service")
    const [isLoading, setIsLoading] = useState(false)

    const {
        serviceData,
        setServiceData,
        serviceImagePreview,
        setServiceImagePreview,
        getServiceImageRootProps,
        getServiceImageInputProps
    } = useServiceForm(vendor?.id)

    const {
        concepts,
        setConcepts,
        conceptImagePreviews,
        currentConceptIndex,
        setCurrentConceptIndex,
        getConceptImagesRootProps,
        getConceptImagesInputProps,
        handleAddConcept,
        handleRemoveConcept,
        handleServiceTypeToggle,
        removeConceptImage
    } = useConceptForm()

    const handleCreateService = async () => {
        if (!serviceData.name || !serviceData.description) {
            toast.error("Vui lòng điền đầy đủ thông tin dịch vụ");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", serviceData.name);
            formData.append("description", serviceData.description);
            formData.append("vendorId", serviceData.vendorId);
            formData.append("status", serviceData.status);
            if (serviceData.image) {
                formData.append("image", serviceData.image);
            }

            const response = await packageService.createPackage(formData) as ApiResponse<{ id: string }>;

            if (response.statusCode === 201 && response?.data?.id) {
                const newServiceId = response?.data?.id;
                localStorage.setItem('currentServiceId', newServiceId);
                setStep("concept");
                toast.success("Tạo dịch vụ thành công! Tiếp tục tạo gói dịch vụ.");
                onSuccess();
            } else {
                toast.error(response.error || "Có lỗi xảy ra khi tạo dịch vụ");
            }
        } catch (error) {
            console.error("Error creating service:", error);
            toast.error("Có lỗi xảy ra khi tạo dịch vụ");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateConcept = async () => {
        const invalidConcepts = concepts.filter(concept => {
            if (!concept.name || !concept.description || concept.price <= 0 || concept.serviceTypeIds.length === 0) {
                return true
            }

            // Validate based on conceptRangeType
            if (concept.conceptRangeType === "một ngày") {
                if (concept.duration <= 0 || concept.numberOfDays !== 1) {
                    return true
                }
            } else if (concept.conceptRangeType === "nhiều ngày") {
                if (concept.duration !== 0 || concept.numberOfDays < 2) {
                    return true
                }
            }

            return false
        })

        if (invalidConcepts.length > 0) {
            toast.error("Vui lòng điền đầy đủ thông tin cho tất cả các gói dịch vụ và đảm bảo validation đúng")
            return
        }

        const serviceId = localStorage.getItem('currentServiceId');

        if (!serviceId) {
            toast.error("Không tìm thấy ID dịch vụ. Vui lòng thử lại.");
            return;
        }

        setIsLoading(true)
        try {
            for (const concept of concepts) {
                const formData = new FormData()
                formData.append("name", concept.name)
                formData.append("description", concept.description)
                formData.append("price", concept.price.toString())
                formData.append("duration", concept.duration.toString())
                formData.append("conceptRangeType", concept.conceptRangeType)
                formData.append("numberOfDays", concept.numberOfDays.toString())
                formData.append("servicePackageId", serviceId)
                formData.append("serviceTypeIds", concept.serviceTypeIds.join(", "))

                concept.images.forEach((image, index) => {
                    if (index < 10) {
                        formData.append("images", image)
                    }
                })

                const response = await packageService.createServiceConcept(formData) as ApiResponse<{ id: string }>

                if (response.statusCode !== 201) {
                    throw new Error(response.error || "Có lỗi xảy ra khi tạo gói dịch vụ")
                }
            }

            localStorage.removeItem('currentServiceId');
            toast.success("Tạo tất cả gói dịch vụ thành công!")
            onSuccess()
            handleClose()
        } catch (error) {
            console.error("Error creating service concepts:", error)
            toast.error("Có lỗi xảy ra khi tạo gói dịch vụ")
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        localStorage.removeItem('currentServiceId');
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        {step === "service" ? (
                            <>
                                <div className="flex items-center gap-2 text-blue-600">
                                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                                        1
                                    </span>
                                    <span className="text-xl font-bold">🚀 Tạo dịch vụ mới</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-green-600">
                                    <span className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full text-sm font-bold">
                                        2
                                    </span>
                                    <span className="text-xl font-bold">📦 Tạo gói dịch vụ</span>
                                </div>
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        {step === "service"
                            ? "✨ Tạo dịch vụ cơ bản trước, sau đó sẽ tạo các gói dịch vụ chi tiết"
                            : "🎯 Tạo gói dịch vụ với giá cả và chi tiết cụ thể"}
                    </DialogDescription>
                </DialogHeader>

                {step === "service" ? (
                    <ServiceForm
                        serviceData={serviceData}
                        setServiceData={setServiceData}
                        serviceImagePreview={serviceImagePreview}
                        setServiceImagePreview={setServiceImagePreview}
                        getServiceImageRootProps={getServiceImageRootProps}
                        getServiceImageInputProps={getServiceImageInputProps}
                    />
                ) : (
                    <ConceptForm
                        concepts={concepts}
                        setConcepts={setConcepts}
                        conceptImagePreviews={conceptImagePreviews}
                        currentConceptIndex={currentConceptIndex}
                        setCurrentConceptIndex={setCurrentConceptIndex}
                        serviceTypes={serviceTypes}
                        getConceptImagesRootProps={getConceptImagesRootProps}
                        getConceptImagesInputProps={getConceptImagesInputProps}
                        handleAddConcept={handleAddConcept}
                        handleRemoveConcept={handleRemoveConcept}
                        handleServiceTypeToggle={handleServiceTypeToggle}
                        removeConceptImage={removeConceptImage}
                    />
                )}

                <DialogFooter className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="cursor-pointer border-gray-300 text-red-500 hover:bg-gray-100 hover:text-red-600" onClick={handleClose} disabled={isLoading}>
                            Hủy
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        {step === "service" ? (
                            <>
                                <Button onClick={handleCreateService} disabled={isLoading} className="gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700">
                                    {isLoading ? "Đang tạo..." : "Tiếp tục"}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={handleCreateConcept} disabled={isLoading} className="cursor-pointer bg-green-600 hover:bg-green-700">
                                    {isLoading ? "Đang tạo..." : "Hoàn thành"}
                                </Button>
                            </>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

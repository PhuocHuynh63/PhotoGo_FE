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
import { ArrowRight, ImageIcon, Upload, X } from "lucide-react"
import toast from "react-hot-toast"
import packageService from "@services/packageServices"
import Image from "next/image"
import { useDropzone } from "react-dropzone"

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
                <Label htmlFor="service-name">Tên dịch vụ *</Label>
                <Input
                    id="service-name"
                    value={serviceData?.name}
                    onChange={(e) => setServiceData((prev: ServiceFormData) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ví dụ: Chụp ảnh cưới"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="service-description">Mô tả dịch vụ *</Label>
                <Textarea
                    id="service-description"
                    value={serviceData?.description}
                    onChange={(e) => setServiceData((prev: ServiceFormData) => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả chi tiết về dịch vụ của bạn"
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="service-status">Trạng thái</Label>
                <Select
                    value={serviceData?.status}
                    onValueChange={(value: "hoạt động" | "không hoạt động") =>
                        setServiceData((prev: ServiceFormData) => ({ ...prev, status: value }))
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
                <div {...getServiceImageRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors">
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
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
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
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="concept-description">Mô tả gói dịch vụ *</Label>
                    <Textarea
                        id="concept-description"
                        value={concepts[currentConceptIndex]?.description}
                        onChange={(e) =>
                            setConcepts((prev: ConceptFormData[]) => {
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
                                setConcepts((prev: ConceptFormData[]) => {
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
                                setConcepts((prev: ConceptFormData[]) => {
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
                        {serviceTypes?.map((type: ServiceType) => (
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

                    {conceptImagePreviews[currentConceptIndex]?.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {conceptImagePreviews[currentConceptIndex].map((preview: string, index: number) => (
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

                    {concepts[currentConceptIndex]?.images.length < 10 && (
                        <div {...getConceptImagesRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
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
                <div className="flex justify-between mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentConceptIndex((prev: number) => Math.max(0, prev - 1))}
                        disabled={currentConceptIndex === 0}
                    >
                        Gói trước
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentConceptIndex((prev: number) => Math.min(concepts.length - 1, prev + 1))}
                        disabled={currentConceptIndex === concepts.length - 1}
                    >
                        Gói tiếp theo
                    </Button>
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
        const invalidConcepts = concepts.filter(
            concept => !concept.name || !concept.description || concept.price <= 0 || concept.serviceTypeIds.length === 0
        )

        if (invalidConcepts.length > 0) {
            toast.error("Vui lòng điền đầy đủ thông tin cho tất cả các gói dịch vụ")
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

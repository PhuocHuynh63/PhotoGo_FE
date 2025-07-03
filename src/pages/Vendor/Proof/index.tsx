"use client"

import type React from "react"

import { useState } from "react"

import {
    Camera,
    Upload,
    CheckCircle,
    Clock,
    Eye,
    Calendar,
    X,
    DollarSign,
    FileText,
    Phone,
    Mail,
    Package,
    ImagePlus,
    Trash2,
} from "lucide-react"
import toast from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Input } from "@components/Atoms/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@components/Atoms/ui/avatar"
import { Badge } from "@components/Atoms/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/Atoms/ui/dialog"
import { Button } from "@components/Atoms/ui/button"
import { Label } from "@components/Atoms/ui/label"
import { Textarea } from "@components/Atoms/ui/textarea"
import CustomDatePicker from "@components/Atoms/DatePicker"

interface Booking {
    id: string
    userId: string
    locationId: string
    serviceConceptId: string
    date: string
    time?: string
    status?: string
    sourceType?: string
    sourceId?: string | null
    depositAmount?: string | number
    depositType?: string
    userNote?: string
    fullName?: string
    phone?: string
    email?: string
    code?: string
    priorityScore?: string
    created_at?: string
    updated_at?: string
}

interface Payment {
    id: string
    invoiceId: string
    amount: string
    paymentOSId: string
    paymentMethod: string
    status: string
    type: string
    transactionId: string
    description: string
    createdAt: string
    updatedAt: string
}

interface Invoice {
    id: string
    bookingId: string
    voucherId?: string | null
    originalPrice: number
    discountAmount: number
    discountedPrice: number
    taxAmount: number
    feeAmount: number
    payablePrice: number
    depositAmount: number
    remainingAmount: number
    paidAmount: number
    status: string
    issuedAt: string
    updatedAt: string
    booking: Booking
    payments: Payment[]
    vendorId: string
    // Proof fields
    proofImages?: string[]
    proofNotes?: string
    proofUploadedAt?: string
    needsProof?: boolean
}

interface ProofManagementPageProps {
    invoices?: Invoice[]
}

function toLocalDateString(date: Date) {
    // Lấy yyyy-mm-dd theo local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function ProofManagementPage({ invoices = [] }: ProofManagementPageProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [filter, setFilter] = useState<"all" | "needs_proof" | "has_proof">("needs_proof")
    const [uploadModal, setUploadModal] = useState<{ open: boolean; invoice?: Invoice }>({ open: false })
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [uploadNotes, setUploadNotes] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const selectedDateStr = selectedDate ? toLocalDateString(selectedDate) : ""
    const filteredInvoices = (invoices || []).filter((invoice) => {
        const bookingDate = invoice.booking.date
        const matchesDate = bookingDate === selectedDateStr
        const matchesFilter =
            filter === "all" ||
            (filter === "needs_proof" && invoice.needsProof) ||
            (filter === "has_proof" && !invoice.needsProof)
        return matchesDate && matchesFilter
    })

    const needsProofCount = (invoices || []).filter((inv) => inv.booking.date === selectedDateStr && inv.needsProof).length
    const hasProofCount = (invoices || []).filter((inv) => inv.booking.date === selectedDateStr && !inv.needsProof).length

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
        if (files.length > 0) {
            setSelectedImages((prev) => [...prev, ...files].slice(0, 10))
        }
    }

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (files.length > 0) {
            setSelectedImages((prev) => [...prev, ...files].slice(0, 10))
        }
    }

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    }

    const clearAllImages = () => {
        setSelectedImages([])
    }

    const handleUploadProof = async () => {
        if (!uploadModal.invoice || selectedImages.length === 0) {
            toast.error("Thiếu thông tin")
            return
        }

        setIsUploading(true)
        try {
            // TODO: Gọi API upload proof ở đây, sau đó refetch hoặc callback lên cha để cập nhật invoices
            await new Promise((resolve) => setTimeout(resolve, 2000))
            toast.success(`Đã upload ${selectedImages.length} ảnh bằng chứng cho đơn ${uploadModal.invoice.booking.code || uploadModal.invoice.booking.id}`)
            setSelectedImages([])
            setUploadNotes("")
            setUploadModal({ open: false })
        } catch {
            toast.error("Có lỗi xảy ra khi upload ảnh")
        } finally {
            setIsUploading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const formatTime = (timeStr: string) => {
        return timeStr.substring(0, 5) // "14:00:00" -> "14:00"
    }

    const formatDateTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr)
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "đã xác nhận":
                return "bg-blue-100 text-blue-800"
            case "đã hoàn thành":
                return "bg-green-100 text-green-800"
            case "đã hủy":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "đã thanh toán đầy đủ":
                return "bg-green-100 text-green-800"
            case "đã thanh toán một phần":
                return "bg-yellow-100 text-yellow-800"
            case "chưa thanh toán":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bằng chứng thực hiện</h2>
                    <p className="text-muted-foreground">Upload ảnh bằng chứng cho các đơn booking đã hoàn thành</p>
                </div>
            </div>

            {/* Date selector và stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Ngày làm việc</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={setSelectedDate}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(selectedDateStr)}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cần bằng chứng</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{needsProofCount}</div>
                        <p className="text-xs text-muted-foreground">đơn cần upload</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã có bằng chứng</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{hasProofCount}</div>
                        <p className="text-xs text-muted-foreground">đơn đã hoàn thành</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng đơn</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{needsProofCount + hasProofCount}</div>
                        <p className="text-xs text-muted-foreground">đơn trong ngày</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter tabs */}
            <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "needs_proof" | "has_proof")} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="needs_proof" className="flex items-center gap-2 cursor-pointer">
                        <Clock className="h-4 w-4" />
                        Cần upload ({needsProofCount})
                    </TabsTrigger>
                    <TabsTrigger value="has_proof" className="flex items-center gap-2 cursor-pointer">
                        <CheckCircle className="h-4 w-4" />
                        Đã có bằng chứng ({hasProofCount})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex items-center gap-2 cursor-pointer">
                        <Calendar className="h-4 w-4" />
                        Tất cả ({needsProofCount + hasProofCount})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="space-y-4">
                    {filteredInvoices.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Không có đơn booking nào</h3>
                                <p className="text-muted-foreground text-center">
                                    {filter === "needs_proof"
                                        ? "Không có đơn nào cần upload bằng chứng trong ngày này"
                                        : filter === "has_proof"
                                            ? "Không có đơn nào đã có bằng chứng trong ngày này"
                                            : "Không có đơn booking nào trong ngày này"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredInvoices.map((invoice) => (
                                <Card key={invoice.id} className="overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src="/placeholder.svg" alt={invoice.booking.fullName || "Không rõ tên"} />
                                                    <AvatarFallback>{invoice.booking.fullName?.charAt(0) || "N/A"}</AvatarFallback>
                                                </Avatar>

                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{invoice.booking.fullName || "Không rõ tên"}</h3>
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                                <span className="flex items-center gap-1">
                                                                    <Phone className="h-3 w-3" />
                                                                    {invoice.booking.phone || "Không có"}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Mail className="h-3 w-3" />
                                                                    {invoice.booking.email || "Không có"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge variant="outline" className="mb-1">
                                                                #{invoice.booking.code || invoice.booking.id?.substring(0, 6) || "N/A"}
                                                            </Badge>
                                                            <p className="text-xs text-muted-foreground">ID: {invoice.id.substring(0, 8)}...</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div className="space-y-1">
                                                            <p className="flex items-center gap-1 font-medium">
                                                                <Clock className="h-3 w-3" />
                                                                {formatTime(invoice.booking.time || "Không có")}
                                                            </p>
                                                            <p className="flex items-center gap-1 text-muted-foreground">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(invoice.booking.date)}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="flex items-center gap-1 font-medium">
                                                                <Package className="h-3 w-3" />
                                                                Service Concept
                                                            </p>
                                                            <p className="text-muted-foreground text-xs">
                                                                ID: {invoice.booking.serviceConceptId.substring(0, 8)}...
                                                            </p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="flex items-center gap-1 font-medium">
                                                                <DollarSign className="h-3 w-3" />
                                                                {formatCurrency(invoice.payablePrice)}
                                                            </p>
                                                            <p className="text-muted-foreground text-xs">
                                                                Đã trả: {formatCurrency(invoice.paidAmount)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Badge variant="outline" className={getStatusColor(invoice.booking.status || invoice.status)}>{invoice.booking.status || invoice.status}</Badge>
                                                        <Badge variant="outline" className={getPaymentStatusColor(invoice.status)}>{invoice.status}</Badge>
                                                        {invoice.needsProof !== false && invoice.needsProof !== undefined ? (
                                                            <Badge variant="outline" className="bg-orange-100 text-orange-800">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Cần bằng chứng
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Đã có bằng chứng
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {invoice.booking.userNote && (
                                                        <div className="bg-muted p-3 rounded-md">
                                                            <p className="text-sm">
                                                                <FileText className="h-3 w-3 inline mr-1" />
                                                                <strong>Ghi chú:</strong> {invoice.booking.userNote}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 ml-4">
                                                {invoice.needsProof ? (
                                                    <Dialog
                                                        open={uploadModal.open && uploadModal.invoice?.id === invoice.id}
                                                        onOpenChange={(open) => setUploadModal({ open, invoice: open ? invoice : undefined })}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                                                                <Camera className="h-4 w-4 mr-2" />
                                                                Upload bằng chứng
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle className="flex items-center gap-2">
                                                                    <Camera className="h-5 w-5" />
                                                                    Upload ảnh bằng chứng
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Đơn booking #{invoice.booking.code} - {invoice.booking.fullName}
                                                                    <br />
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {formatDate(invoice.booking.date)} lúc {formatTime(invoice.booking.time || "Không có")}
                                                                    </span>
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            <div className="space-y-6">
                                                                {/* Drag & Drop Zone */}
                                                                <div
                                                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                                                        ? "border-orange-500 bg-orange-50"
                                                                        : "border-gray-300 hover:border-gray-400"
                                                                        }`}
                                                                    onDragEnter={handleDrag}
                                                                    onDragLeave={handleDrag}
                                                                    onDragOver={handleDrag}
                                                                    onDrop={handleDrop}
                                                                >
                                                                    <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                                    <div className="space-y-2">
                                                                        <p className="text-lg font-medium">Kéo thả ảnh vào đây hoặc click để chọn</p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Hỗ trợ JPG, PNG, GIF (tối đa 10 ảnh)
                                                                        </p>
                                                                        <Input
                                                                            type="file"
                                                                            multiple
                                                                            accept="image/*"
                                                                            onChange={handleImageSelect}
                                                                            className="hidden"
                                                                            id="image-upload"
                                                                        />
                                                                        <Label htmlFor="image-upload">
                                                                            <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                                                                                <span>Chọn ảnh từ máy tính</span>
                                                                            </Button>
                                                                        </Label>
                                                                    </div>
                                                                </div>

                                                                {/* Selected Images Preview */}
                                                                {selectedImages.length > 0 && (
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between">
                                                                            <Label className="text-base font-medium">
                                                                                Ảnh đã chọn ({selectedImages.length}/10)
                                                                            </Label>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={clearAllImages}
                                                                                className="text-red-600 hover:text-red-700 bg-transparent"
                                                                            >
                                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                                Xóa tất cả
                                                                            </Button>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                            {selectedImages.map((file, index) => (
                                                                                <div key={index} className="relative group">
                                                                                    <img
                                                                                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                                                                                        alt={`Preview ${index + 1}`}
                                                                                        className="w-full h-24 object-cover rounded-lg border"
                                                                                    />
                                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="destructive"
                                                                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                                                                            onClick={() => removeImage(index)}
                                                                                        >
                                                                                            <X className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </div>
                                                                                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                                                                        {index + 1}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Notes */}
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="notes" className="text-base font-medium">
                                                                        Ghi chú về buổi thực hiện (tùy chọn)
                                                                    </Label>
                                                                    <Textarea
                                                                        id="notes"
                                                                        placeholder="Ví dụ: Đã hoàn thành chụp ảnh cưới tại công viên. Khách hàng rất hài lòng với kết quả..."
                                                                        value={uploadNotes}
                                                                        onChange={(e) => setUploadNotes(e.target.value)}
                                                                        className="min-h-[100px]"
                                                                    />
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div className="flex justify-end gap-3 pt-4 border-t">
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            setUploadModal({ open: false })
                                                                            setSelectedImages([])
                                                                            setUploadNotes("")
                                                                        }}
                                                                        disabled={isUploading}
                                                                    >
                                                                        Hủy
                                                                    </Button>
                                                                    <Button
                                                                        onClick={handleUploadProof}
                                                                        disabled={selectedImages.length === 0 || isUploading}
                                                                        size="lg"
                                                                        className="bg-orange-500 hover:bg-orange-600"
                                                                    >
                                                                        {isUploading ? (
                                                                            <>
                                                                                <Upload className="h-4 w-4 mr-2 animate-pulse" />
                                                                                Đang upload...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Upload className="h-4 w-4 mr-2" />
                                                                                Upload {selectedImages.length} ảnh
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                ) : (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="lg">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem bằng chứng
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle className="flex items-center gap-2">
                                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                                    Bằng chứng thực hiện
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Đơn booking #{invoice.booking.code} - {invoice.booking.fullName}
                                                                    {invoice.proofUploadedAt && (
                                                                        <span className="block mt-1 text-green-600">
                                                                            ✓ Upload lúc: {formatDateTime(invoice.proofUploadedAt)}
                                                                        </span>
                                                                    )}
                                                                </DialogDescription>
                                                            </DialogHeader>

                                                            <div className="space-y-6">
                                                                {invoice.proofImages && invoice.proofImages.length > 0 && (
                                                                    <div>
                                                                        <Label className="text-base font-medium mb-3 block">
                                                                            Ảnh bằng chứng ({invoice.proofImages.length} ảnh)
                                                                        </Label>
                                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                                            {invoice.proofImages.map((image, index) => (
                                                                                <img
                                                                                    key={index}
                                                                                    src={image || "/placeholder.svg"}
                                                                                    alt={`Proof ${index + 1}`}
                                                                                    className="w-full h-32 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
                                                                                    onClick={() => window.open(image, "_blank")}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {invoice.proofNotes && (
                                                                    <div>
                                                                        <Label className="text-base font-medium mb-2 block">Ghi chú</Label>
                                                                        <div className="bg-muted p-4 rounded-lg">
                                                                            <p className="text-sm leading-relaxed">{invoice.proofNotes}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

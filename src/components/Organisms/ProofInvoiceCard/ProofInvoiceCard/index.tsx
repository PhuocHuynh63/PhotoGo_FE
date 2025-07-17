"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@components/Atoms/ui/avatar"
import { Badge } from "@components/Atoms/ui/badge"
import { Button } from "@components/Atoms/ui/button"
import { Card, CardContent } from "@components/Atoms/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/Atoms/ui/dialog"
import { FileText, Phone, Mail, Package, Clock, Calendar, CheckCircle, Camera, Eye, ImagePlus, Trash2, X, Upload } from "lucide-react"
import { Input } from "@components/Atoms/ui/input"
import { Label } from "@components/Atoms/ui/label"
import React from "react"
import toast from "react-hot-toast"
import albumVendorService from "@services/albumVendor"
import { type Invoice, type ApiResponse } from "@utils/hooks/useAlbumData"

interface ProofInvoiceCardProps {
    invoice: Invoice;
    uploadModal: { open: boolean; invoice?: Invoice };
    setUploadModal: (modal: { open: boolean; invoice?: Invoice }) => void;
    formatCurrency: (amount: number) => string;
    formatDate: (dateStr: string) => string;
    formatTime: (timeStr: string) => string;
    formatDateTime: (dateTimeStr: string) => string;
    getStatusColor: (status: string) => string;
    getPaymentStatusColor: (status: string) => string;
    onUploadSuccess?: () => void;
}

export default function ProofInvoiceCard({ invoice, uploadModal, setUploadModal, formatDate, formatTime, formatDateTime, getStatusColor, getPaymentStatusColor, onUploadSuccess }: ProofInvoiceCardProps) {
    const [photos, setPhotos] = React.useState<File[]>([])
    const [behindTheScenes, setBehindTheScenes] = React.useState<File[]>([])
    const [driveLink, setDriveLink] = React.useState("")
    const [isUploading, setIsUploading] = React.useState(false)
    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index))
    }

    const removeBehindTheScene = (index: number) => {
        setBehindTheScenes((prev) => prev.filter((_, i) => i !== index))
    }

    const clearAllPhotos = () => {
        setPhotos([])
    }

    const clearAllBehindTheScenes = () => {
        setBehindTheScenes([])
    }

    const handleUploadProof = async () => {
        if (!uploadModal.invoice || (photos.length === 0 && behindTheScenes.length === 0 && !driveLink.trim())) {
            toast.error("Vui lòng thêm ít nhất một ảnh hoặc link Google Drive")
            return
        }
        const album = await albumVendorService.getAlbumByBookingId(invoice.bookingId, 1, 10, "createdAt", "DESC") as ApiResponse
        const albumId = album?.data?.data[0]?.id

        if (!albumId) {
            toast.error("Không tìm thấy album cho booking này")
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()

            // Add required fields
            formData.append('locationId', invoice.booking.locationId)


            // Add optional Google Drive link
            if (driveLink.trim()) {
                formData.append('driveLink', driveLink.trim())
            }

            // Add photos (max 3)
            photos.slice(0, 3).forEach((file) => {
                formData.append('photos', file)
            })

            // Add behind the scenes (max 3)
            behindTheScenes.slice(0, 3).forEach((file) => {
                formData.append('behindTheScenes', file)
            })

            // Call actual API
            const response = await albumVendorService.uploadAlbum(albumId, formData)

            if (response && typeof response === 'object' && 'data' in response) {
                toast.success(`Đã upload thành công bằng chứng cho đơn ${uploadModal.invoice!.booking?.code || uploadModal.invoice!.booking.id}`)
                setPhotos([])
                setBehindTheScenes([])
                setDriveLink("")
                setUploadModal({ open: false })
                // Refresh data after successful upload
                onUploadSuccess?.()
            } else {
                throw new Error('Upload failed')
            }
        } catch (error: unknown) {
            console.error('Upload error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi upload ảnh'
            toast.error(errorMessage)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg" alt={invoice?.booking?.fullName || "Không rõ tên"} />
                            <AvatarFallback>{invoice?.booking.fullName?.charAt(0) || "N/A"}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-3 flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{invoice?.booking?.fullName || "Không rõ tên"}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {invoice?.booking?.phone || "Không có"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {invoice?.booking?.email || "Không có"}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="mb-1">
                                        #{invoice?.booking?.code || invoice?.booking?.id?.substring(0, 6) || "N/A"}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground">ID: {invoice?.id.substring(0, 8)}...</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="space-y-1">
                                    <p className="flex items-center gap-1 font-medium">
                                        <Clock className="h-3 w-3" />
                                        {formatTime(invoice?.booking?.time || "Không có")}
                                    </p>
                                    <p className="flex items-center gap-1 text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(invoice?.booking?.date)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="flex items-center gap-1 font-medium">
                                        <Package className="h-3 w-3" />
                                        Service Concept
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        ID: {invoice?.booking?.serviceConceptId.substring(0, 8)}...
                                    </p>
                                </div>
                                {/* <div className="space-y-1">
                                    <p className="flex items-center gap-1 font-medium">
                                        <Coins className="h-3 w-3" />
                                        {formatCurrency(invoice?.payablePrice)}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Đã trả: {formatCurrency(invoice?.paidAmount)}
                                    </p>
                                </div> */}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={getStatusColor(invoice?.booking?.status || invoice?.status)}>{invoice?.booking.status || invoice?.status}</Badge>
                                <Badge variant="outline" className={getPaymentStatusColor(invoice?.status)}>{invoice?.status}</Badge>
                                {invoice?.needsProof !== false && invoice?.needsProof !== undefined ? (
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
                            {invoice?.booking?.userNote && (
                                <div className="bg-muted p-3 rounded-md">
                                    <p className="text-sm">
                                        <FileText className="h-3 w-3 inline mr-1" />
                                        <strong>Ghi chú:</strong> {invoice?.booking?.userNote}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        {invoice?.needsProof ? (
                            <Dialog
                                open={uploadModal.open && uploadModal.invoice?.id === invoice?.id}
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
                                            Đơn booking #{invoice?.booking?.code} - {invoice?.booking?.fullName}
                                            <br />
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(invoice?.booking?.date)} lúc {formatTime(invoice?.booking?.time || "Không có")}
                                            </span>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-8">
                                        {/* Google Drive Link Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <ImagePlus className="h-5 w-5 text-blue-600" />
                                                <Label className="text-lg font-semibold">Link Google Drive (tùy chọn)</Label>
                                            </div>
                                            <Input
                                                type="url"
                                                placeholder="Nhập link Google Drive (ví dụ: https://drive.google.com/file/d/...)"
                                                value={driveLink}
                                                onChange={(e) => setDriveLink(e.target.value)}
                                                className="h-12"
                                            />
                                        </div>

                                        {/* Photos Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Camera className="h-5 w-5 text-green-600" />
                                                <Label className="text-lg font-semibold">Ảnh chính (tối đa 3 ảnh)</Label>
                                                <Badge variant="secondary">{photos.length}/3</Badge>
                                            </div>

                                            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center transition-colors hover:border-green-400 bg-green-50/50">
                                                <Camera className="h-10 w-10 text-green-600 mx-auto mb-3" />
                                                <p className="font-medium text-green-800 mb-1">Upload ảnh chính</p>
                                                <p className="text-sm text-green-600 mb-3">JPG, PNG, GIF (tối đa 3 ảnh)</p>
                                                <Input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || [])
                                                        if (files.length > 0) {
                                                            setPhotos((prev) => [...prev, ...files].slice(0, 3))
                                                        }
                                                    }}
                                                    className="hidden"
                                                    id={`photos-upload-${invoice?.id}`}
                                                />
                                                <Label htmlFor={`photos-upload-${invoice?.id}`}>
                                                    <Button variant="outline" className="bg-white hover:bg-green-50" asChild>
                                                        <span>Chọn ảnh chính</span>
                                                    </Button>
                                                </Label>
                                            </div>

                                            {photos.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="font-medium text-green-800">
                                                            Ảnh chính đã chọn ({photos.length}/3)
                                                        </Label>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={clearAllPhotos}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Xóa tất cả
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {photos.map((file, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={`Photo ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                                                                />
                                                                <div className="absolute inset-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                                                        onClick={() => removePhoto(index)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                                                    {index + 1}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Behind The Scenes Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Eye className="h-5 w-5 text-purple-600" />
                                                <Label className="text-lg font-semibold">Ảnh behind the scenes (tối đa 3 ảnh)</Label>
                                                <Badge variant="secondary">{behindTheScenes.length}/3</Badge>
                                            </div>

                                            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center transition-colors hover:border-purple-400 bg-purple-50/50">
                                                <Eye className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                                                <p className="font-medium text-purple-800 mb-1">Upload ảnh behind the scenes</p>
                                                <p className="text-sm text-purple-600 mb-3">JPG, PNG, GIF (tối đa 3 ảnh)</p>
                                                <Input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || [])
                                                        if (files.length > 0) {
                                                            setBehindTheScenes((prev) => [...prev, ...files].slice(0, 3))
                                                        }
                                                    }}
                                                    className="hidden"
                                                    id={`behind-scenes-upload-${invoice?.id}`}
                                                />
                                                <Label htmlFor={`behind-scenes-upload-${invoice?.id}`}>
                                                    <Button variant="outline" className="bg-white hover:bg-purple-50" asChild>
                                                        <span>Chọn ảnh behind the scenes</span>
                                                    </Button>
                                                </Label>
                                            </div>

                                            {behindTheScenes.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="font-medium text-purple-800">
                                                            Behind the scenes đã chọn ({behindTheScenes.length}/3)
                                                        </Label>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={clearAllBehindTheScenes}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Xóa tất cả
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {behindTheScenes.map((file, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={`Behind scenes ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-lg border-2 border-purple-200"
                                                                />
                                                                <div className="absolute inset-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                                                        onClick={() => removeBehindTheScene(index)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                                <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                                                    {index + 1}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 pt-6 border-t">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setUploadModal({ open: false })
                                                    setPhotos([])
                                                    setBehindTheScenes([])
                                                    setDriveLink("")
                                                }}
                                                disabled={isUploading}
                                                size="lg"
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                onClick={handleUploadProof}
                                                disabled={(photos.length === 0 && behindTheScenes.length === 0 && !driveLink.trim()) || isUploading}
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
                                                        Upload bằng chứng
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
                                            Đơn booking #{invoice?.booking?.code} - {invoice?.booking?.fullName}
                                            {invoice?.proofUploadedAt && (
                                                <span className="block mt-1 text-green-600">
                                                    ✓ Upload lúc: {formatDateTime(invoice?.proofUploadedAt)}
                                                </span>
                                            )}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6">
                                        {/* Drive Link */}
                                        {invoice?.driveLink && (
                                            <div>
                                                <Label className="text-base font-medium mb-3 block">Link Google Drive</Label>
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                    <a
                                                        href={invoice.driveLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 underline break-all"
                                                    >
                                                        {invoice.driveLink}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Main Photos */}
                                        {invoice?.photos && invoice?.photos.length > 0 && (
                                            <div>
                                                <Label className="text-base font-medium mb-3 block">
                                                    Ảnh chính ({invoice?.photos.length} ảnh)
                                                </Label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {invoice?.photos.map((image, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={image || "/placeholder.svg"}
                                                                alt={`Photo ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg border-2 border-green-200 hover:scale-105 transition-transform cursor-pointer"
                                                                onClick={() => window.open(image, "_blank")}
                                                                onError={(e) => {
                                                                    console.error('Error loading image:', image);
                                                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Behind The Scenes */}
                                        {invoice?.behindTheScenes && invoice?.behindTheScenes.length > 0 && (
                                            <div>
                                                <Label className="text-base font-medium mb-3 block">
                                                    Behind the scenes ({invoice?.behindTheScenes.length} ảnh)
                                                </Label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {invoice?.behindTheScenes.map((image, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={image || "/placeholder.svg"}
                                                                alt={`Behind scenes ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg border-2 border-purple-200 hover:scale-105 transition-transform cursor-pointer"
                                                                onClick={() => window.open(image, "_blank")}
                                                                onError={(e) => {
                                                                    console.error('Error loading behind scenes image:', image);
                                                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Fallback to proofImages for backwards compatibility */}
                                        {(!invoice?.photos || invoice?.photos.length === 0) && invoice?.proofImages && invoice?.proofImages.length > 0 && (
                                            <div>
                                                <Label className="text-base font-medium mb-3 block">
                                                    Ảnh bằng chứng ({invoice?.proofImages.length} ảnh)
                                                </Label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {invoice?.proofImages.map((image, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={image || "/placeholder.svg"}
                                                                alt={`Proof ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
                                                                onClick={() => window.open(image, "_blank")}
                                                                onError={(e) => {
                                                                    console.error('Error loading proof image:', image);
                                                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* No Images Message */}
                                        {(!invoice?.photos || invoice?.photos.length === 0) &&
                                            (!invoice?.behindTheScenes || invoice?.behindTheScenes.length === 0) &&
                                            (!invoice?.proofImages || invoice?.proofImages.length === 0) &&
                                            !invoice?.driveLink && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                                    <p className="text-yellow-800 font-medium">Chưa có ảnh bằng chứng nào được upload</p>
                                                    <p className="text-yellow-600 text-sm mt-1">
                                                        Vendor chưa upload ảnh hoặc link Google Drive cho booking này
                                                    </p>
                                                </div>
                                            )}

                                        {invoice?.proofNotes && (
                                            <div>
                                                <Label className="text-base font-medium mb-2 block">Ghi chú</Label>
                                                <div className="bg-muted p-4 rounded-lg">
                                                    <p className="text-sm leading-relaxed">{invoice?.proofNotes}</p>
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
    )
} 
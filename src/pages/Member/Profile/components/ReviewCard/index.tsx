import { Badge } from "@components/Atoms/ui/badge"
import { Button } from "@components/Atoms/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@components/Atoms/ui/card"
import StarRating from "@components/Molecules/StarRating"
import { IReviewVendorDetailModel } from "@models/review/common.model"
import Image from "next/image"
import { useState, useRef } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@components/Atoms/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@components/Atoms/ui/alert-dialog"
import { Textarea } from "@components/Atoms/ui/textarea"
import { Input } from "@components/Atoms/ui/input"
import { ImagePlus, Loader2, X } from "lucide-react"
import reviewService from "@services/review"
import { toast } from "react-hot-toast"
import { IDeleteVoucherResponseModel, IEditVoucherResponseModel } from "@models/voucher/response.model"

interface ReviewCardProps {
    reviewData: IReviewVendorDetailModel
    onSuccess?: () => void
}

export default function ReviewCard({ reviewData, onSuccess }: ReviewCardProps) {
    //#region define variables
    const isPending = !reviewData?.comment || reviewData?.comment.trim() === ''
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editData, setEditData] = useState({
        comment: reviewData?.comment || '',
        rating: reviewData?.rating || 0,
        images: reviewData?.images || []
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newImages, setNewImages] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>(reviewData?.images || [])
    const fileInputRef = useRef<HTMLInputElement>(null)
    //#endregion

    //#region helper functions
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    const lightboxImages = reviewData?.images?.map(image => ({ src: image })) || []

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index)
        setLightboxOpen(true)
    }

    const uploadImages = async (files: File[]): Promise<string[]> => {
        // TODO: Implement your image upload logic here
        // This should upload the images to your storage service and return the URLs
        // For now, we'll just return empty array
        return []
    }

    const handleEdit = async () => {
        if (!reviewData?.id) return
        try {
            setIsSubmitting(true)

            // Upload new images if any
            let uploadedImageUrls: string[] = []
            if (newImages.length > 0) {
                uploadedImageUrls = await uploadImages(newImages)
            }

            // Combine existing images that weren't removed with new image URLs
            const finalImages = [...previewImages.filter(url => reviewData.images?.includes(url)), ...uploadedImageUrls]

            // Call the API to update the review
            const response = await reviewService.editReview(reviewData.id, {
                rating: editData.rating,
                comment: editData.comment,
                images: finalImages,
                bookingId: reviewData.booking.id,
                vendorId: reviewData.vendor.id
            }) as IEditVoucherResponseModel

            if (response.statusCode === 200) {
                toast.success('Đánh giá đã được cập nhật thành công')
                setIsEditing(false)
                onSuccess?.()
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi cập nhật đánh giá')
            }
        } catch (error) {
            console.error('Error editing review:', error)
            toast.error('Có lỗi xảy ra khi cập nhật đánh giá')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!reviewData?.id) return
        try {
            setIsSubmitting(true)
            const response = await reviewService.deleteReview(reviewData.id) as IDeleteVoucherResponseModel
            if (response.statusCode === 200) {
                toast.success('Đánh giá đã được xóa thành công')
                setIsDeleting(false)
                onSuccess?.()
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi xóa đánh giá')
            }
        } catch (error) {
            console.error('Error deleting review:', error)
            toast.error('Có lỗi xảy ra khi xóa đánh giá')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        const newFilesArray = Array.from(files)
        setNewImages(prev => [...prev, ...newFilesArray])

        // Create preview URLs for the new images
        const newPreviewUrls = newFilesArray.map(file => URL.createObjectURL(file))
        setPreviewImages(prev => [...prev, ...newPreviewUrls])

        // Reset the input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveImage = (index: number) => {
        const imageUrl = previewImages[index]
        setPreviewImages(prev => prev.filter((_, i) => i !== index))

        // If it's a new image (has a blob URL), remove it from newImages
        if (imageUrl.startsWith('blob:')) {
            setNewImages(prev => prev.filter((_, i) => i !== index))
            URL.revokeObjectURL(imageUrl) // Clean up the blob URL
        }
        // If it's an existing image, update editData.images
        else if (reviewData.images?.includes(imageUrl)) {
            setEditData(prev => ({
                ...prev,
                images: prev.images.filter(img => img !== imageUrl)
            }))
        }
    }
    //#endregion

    return (
        <>
            <Card>
                {/* Card Header */}
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <h3 className="font-semibold text-lg leading-tight">{reviewData?.vendor?.name || 'Dịch vụ nhiếp ảnh'}</h3>
                                <div className="flex-shrink-0">
                                    {isPending ? (
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                                            Chưa đánh giá
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                            Đã đánh giá
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{reviewData?.user?.fullName || 'Người dùng'}</p>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                            <p className="text-sm text-muted-foreground">Mã đơn: {reviewData?.booking?.id?.slice(-6) || 'N/A'}</p>
                        </div>
                    </div>
                </CardHeader>

                {/* Card Content */}
                <CardContent className="pb-2">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Vendor Logo */}
                        {reviewData?.images && reviewData?.images?.length > 0 && (
                            <div className="md:w-1/4 lg:w-1/5">
                                <div className="grid grid-cols-1 gap-2 ư">
                                    <Image
                                        about={reviewData?.vendor?.name || ""}
                                        title={reviewData?.vendor?.name || ""}
                                        loading="lazy"
                                        quality={100}
                                        src={reviewData?.vendor?.logoUrl || ""}
                                        alt="Vendor logo"
                                        width={300}
                                        height={300}
                                        className="rounded-md object-cover w-full h-32 sm:h-64 md:h-64 lg:h-56"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Review Content */}
                        <div className={reviewData?.images && reviewData?.images?.length > 0 ? "md:w-3/4 lg:w-4/5" : "w-full"}>
                            {isPending ? (
                                /* Pending Review State */
                                <div className="bg-muted p-4 rounded-md">
                                    <p className="mb-2 font-medium">Bạn chưa đánh giá dịch vụ này</p>
                                    <div className="flex gap-1 mb-4">
                                        <StarRating stars={reviewData?.rating || 0} size={20} />
                                    </div>
                                    <Button>Viết đánh giá</Button>
                                </div>
                            ) : (
                                /* Completed Review State */
                                <div className="bg-muted/30 p-4 rounded-md">
                                    {/* Rating and Date */}
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex gap-1">
                                            <StarRating stars={reviewData?.rating || 0} size={20} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Đánh giá ngày: {formatDate(reviewData?.createdAt)}
                                        </p>
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-sm">{reviewData?.comment}</p>

                                    {/* User Info */}
                                    {reviewData?.user && (
                                        <div className="mt-2 pt-2 border-t border-muted">
                                            <p className="text-xs text-muted-foreground">
                                                Đánh giá bởi: {reviewData?.user?.fullName}
                                            </p>
                                        </div>
                                    )}

                                    {/* Review Images Grid */}
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-2">
                                        {reviewData?.images && reviewData?.images?.slice(0, 5).map((imageUrl, index) => (
                                            <Image
                                                key={index}
                                                src={imageUrl}
                                                alt={`Review image ${index + 1}`}
                                                loading="lazy"
                                                quality={100}
                                                width={300}
                                                height={150}
                                                className="aspect-square rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => handleImageClick(index)}
                                            />
                                        ))}
                                        {reviewData?.images && reviewData?.images?.length > 5 && (
                                            <div className="aspect-square bg-muted rounded-md cursor-pointer hover:bg-muted/80 flex items-center justify-center text-xs text-muted-foreground font-medium"
                                                onClick={() => handleImageClick(5)}>
                                                +{reviewData?.images?.length - 5}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                {/* Card Footer */}
                <CardFooter className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                        Xem chi tiết đơn
                    </Button>
                    {isPending ? (
                        <Button size="sm" className="cursor-pointer">Đánh giá ngay</Button>
                    ) : (
                        <>
                            <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setIsEditing(true)}>
                                Chỉnh sửa đánh giá
                            </Button>
                            <Button variant="destructive" size="sm" className="cursor-pointer text-white" onClick={() => setIsDeleting(true)}>
                                Xóa đánh giá
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
                        <DialogDescription>
                            Chỉnh sửa đánh giá của bạn cho dịch vụ này
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-4">
                            <StarRating
                                stars={editData.rating}
                                size={24}
                                interactive={true}
                                onClick={(rating) => setEditData(prev => ({ ...prev, rating }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Textarea
                                value={editData.comment}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditData(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Nhập đánh giá của bạn..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium">Hình ảnh</h4>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    ref={fileInputRef}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImagePlus className="h-4 w-4 mr-2" />
                                    Thêm ảnh
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {previewImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <Image
                                            src={image}
                                            alt={`Review image ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="rounded-md object-cover aspect-square"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
                        <Button onClick={handleEdit} disabled={isSubmitting}>
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" onClick={() => setIsDeleting(false)}>Hủy</AlertDialogCancel>
                        <AlertDialogAction className="cursor-pointer" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Xóa'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Lightbox */}
            {lightboxImages.length > 0 && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={lightboxImages}
                    index={currentImageIndex}
                />
            )}
        </>
    )
}
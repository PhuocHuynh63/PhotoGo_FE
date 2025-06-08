import { Badge } from "@components/Atoms/ui/badge"
import { Button } from "@components/Atoms/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@components/Atoms/ui/card"
import StarRating from "@components/Molecules/StarRating"
import { IReviewVendorDetailModel } from "@models/review/common.model"
import Image from "next/image"
import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface ReviewCardProps {
    reviewData: IReviewVendorDetailModel
}

export default function ReviewCard({ reviewData }: ReviewCardProps) {
    //#region define variables
    const isPending = !reviewData?.comment || reviewData?.comment.trim() === ''
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
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
    //#endregion

    return (
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
                    <Button variant="outline" size="sm" className="cursor-pointer">
                        Chỉnh sửa đánh giá
                    </Button>
                )}
            </CardFooter>

            {/* Lightbox */}
            {lightboxImages.length > 0 && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={lightboxImages}
                    index={currentImageIndex}
                />
            )}
        </Card>
    )
}
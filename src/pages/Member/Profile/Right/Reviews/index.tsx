'use client'

import { Badge } from "@components/Atoms/ui/badge"
import { Button } from "@components/Atoms/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@components/Atoms/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import StarRating from "@components/Molecules/StarRating"
import Pagination from "@components/Organisms/Pagination/Pagination"
import { IPagination } from "@models/metadata"
import { IReviewVendorDetailModel } from "@models/review/common.model"
import { IReviewPaginationResponseModel } from "@models/review/repsonse.model"
import Image from "next/image"
import { useState, useTransition } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface GetReviewsActionResult {
    success: boolean
    data?: IReviewPaginationResponseModel
    error?: string
}

interface ReviewsPageProps {
    reviews: IReviewVendorDetailModel[]
    pagination: IPagination
    getReviewsAction?: (page: number, pageSize: number) => Promise<GetReviewsActionResult>
}

export default function ReviewsPage({ reviews: initialReviews, pagination: initialPagination, getReviewsAction }: ReviewsPageProps) {
    console.log(initialReviews)
    console.log(initialPagination)
    
    const [reviews, setReviews] = useState(initialReviews)
    const [pagination, setPagination] = useState(initialPagination)
    const [currentPage, setCurrentPage] = useState(pagination?.current || 1)
    const [isPending, startTransition] = useTransition()

    // Phân loại reviews
    const allReviews = reviews || []
    const pendingReviews = allReviews.filter(review => !review.comment || review.comment.trim() === '')
    const completedReviews = allReviews.filter(review => review.comment && review.comment.trim() !== '')

    const handlePageChange = async (page: number) => {
        if (!getReviewsAction) return;
        
        setCurrentPage(page)
        
        startTransition(async () => {
            try {
                const result = await getReviewsAction(page, pagination.pageSize)
                
                if (result.success && result.data) {
                    setReviews(result.data.data)
                    setPagination(result.data.pagination)
                } else {
                    console.error('Failed to fetch reviews:', result.error)
                }
            } catch (error) {
                console.error('Error fetching reviews:', error)
            }
        })
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Đánh giá dịch vụ</h1>
                <p className="text-muted-foreground">Xem và quản lý đánh giá cho các dịch vụ bạn đã sử dụng</p>
            </div>

            {isPending && (
                <div className="text-center py-4">
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            )}

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="all" className="cursor-pointer">Tất cả ({allReviews.length})</TabsTrigger>
                    <TabsTrigger value="pending" className="cursor-pointer">Chưa đánh giá ({pendingReviews.length})</TabsTrigger>
                    <TabsTrigger value="completed" className="cursor-pointer">Đã đánh giá ({completedReviews.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <div className="grid gap-6">
                        {allReviews.length > 0 ? (
                            allReviews.map((review) => (
                                <ReviewCard key={review.id} reviewData={review} />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Chưa có đánh giá nào</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Pagination for All Reviews */}
                    {pagination && pagination.totalPage > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                current={currentPage}
                                total={pagination.totalPage}
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="pending">
                    <div className="grid gap-6">
                        {pendingReviews.length > 0 ? (
                            pendingReviews.map((review) => (
                                <ReviewCard key={review.id} reviewData={review} />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Không có đánh giá nào đang chờ</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="completed">
                    <div className="grid gap-6">
                        {completedReviews.length > 0 ? (
                            completedReviews.map((review) => (
                                <ReviewCard key={review.id} reviewData={review} />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Chưa có đánh giá nào hoàn thành</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Pagination Info */}
            {pagination && (
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Hiển thị {((currentPage - 1) * pagination.pageSize) + 1} - {Math.min(currentPage * pagination.pageSize, pagination.totalItem)} trong tổng số {pagination.totalItem} đánh giá
                </div>
            )}
        </div>
    )
}

interface ReviewCardProps {
    reviewData: IReviewVendorDetailModel
}

function ReviewCard({ reviewData }: ReviewCardProps) {
    const isPending = !reviewData.comment || reviewData.comment.trim() === ''
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    // Prepare images for lightbox
    const lightboxImages = reviewData.images?.map(image => ({ src: image })) || []

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index)
        setLightboxOpen(true)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{reviewData.vendor?.name || 'Dịch vụ nhiếp ảnh'}</h3>
                        {isPending ? (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Chưa đánh giá
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Đã đánh giá
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">{reviewData.user?.fullName || 'Người dùng'}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Mã đơn: {reviewData.booking?.id?.slice(-6) || 'N/A'}</p>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="flex flex-col md:flex-row gap-6">
                    {reviewData.images && reviewData.images.length > 0 && (
                        <div className="md:w-1/3">
                            <div className="grid grid-cols-1 gap-2">
                                <Image 
                                    src={reviewData?.vendor?.logoUrl || ""} 
                                    alt="Vendor logo" 
                                    width={300} 
                                    height={300} 
                                    className="rounded-md object-cover w-full h-full" 
                                />
                            </div>
                        </div>
                    )}
                    <div className={reviewData.images && reviewData.images.length > 0 ? "md:w-2/3" : "w-full"}>

                        {isPending ? (
                            <div className="bg-muted p-4 rounded-md">
                                <p className="mb-2 font-medium">Bạn chưa đánh giá dịch vụ này</p>
                                <div className="flex gap-1 mb-4">
                                    <StarRating stars={reviewData?.rating || 0} size={20} />
                                </div>
                                <Button>Viết đánh giá</Button>
                            </div>
                        ) : (
                            <div className="bg-muted/30 p-4 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex gap-1">
                                        <StarRating stars={reviewData?.rating || 0} size={20} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Đánh giá ngày: {formatDate(reviewData.createdAt)}
                                    </p>
                                </div>
                                <p className="text-sm">{reviewData.comment}</p>
                                {reviewData.user && (
                                    <div className="mt-2 pt-2 border-t border-muted">
                                        <p className="text-xs text-muted-foreground">
                                            Đánh giá bởi: {reviewData.user.fullName}
                                        </p>
                                    </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                    {reviewData.images && reviewData.images.slice(0, 2).map((imageUrl, index) => (
                                        <Image
                                            key={index}
                                            src={imageUrl}
                                            alt={`Review image ${index + 1}`}
                                            width={300}
                                            height={150}
                                            className="rounded-md object-cover w-28 h-28 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => handleImageClick(index)}
                                        />
                                    ))}
                                    {reviewData.images && reviewData.images.length > 2 && (
                                        <div className="text-xs text-muted-foreground text-center flex items-center justify-center w-28 h-28 bg-muted rounded-md cursor-pointer hover:bg-muted/80" 
                                             onClick={() => handleImageClick(2)}>
                                            +{reviewData.images.length - 2} ảnh khác
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
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

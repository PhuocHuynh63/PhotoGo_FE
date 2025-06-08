'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import Pagination from "@components/Organisms/Pagination/Pagination"
import { IPagination } from "@models/metadata"
import { IReviewVendorDetailModel } from "@models/review/common.model"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import ReviewCard from "../../components/ReviewCard"

interface ReviewsPageProps {
    reviews: IReviewVendorDetailModel[]
    pagination: IPagination
}

export default function ReviewsPage({ reviews, pagination }: ReviewsPageProps) {

    //#region define variables
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentPage, setCurrentPage] = useState(pagination?.current || 1)
    //#endregion

    //#region data processing
    const allReviews = reviews || []
    const pendingReviews = allReviews.filter(review => !review.comment || review.comment.trim() === '')
    const completedReviews = allReviews.filter(review => review.comment && review.comment.trim() !== '')
    //#endregion

    //#region handle pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page)

        // Create new URL search params
        const params = new URLSearchParams(searchParams?.toString() || '')
        params.set('page', page.toString())

        // Navigate to new URL which will trigger server-side re-render
        router.push(`/profile/reviews?${params.toString()}`)
    }
    //#endregion

    return (
        <div className="container mx-auto py-6">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Đánh giá dịch vụ</h1>
                <p className="text-muted-foreground">Xem và quản lý đánh giá cho các dịch vụ bạn đã sử dụng</p>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="all" className="cursor-pointer">Tất cả ({pagination?.totalItem})</TabsTrigger>
                    <TabsTrigger value="pending" className="cursor-pointer">Chưa đánh giá ({pendingReviews?.length})</TabsTrigger>
                    <TabsTrigger value="completed" className="cursor-pointer">Đã đánh giá ({completedReviews?.length})</TabsTrigger>
                </TabsList>

                {/* All Reviews Tab */}
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

                    {/* Pagination */}
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

                {/* Pending Reviews Tab */}
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

                {/* Completed Reviews Tab */}
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
        </div>
    )
}

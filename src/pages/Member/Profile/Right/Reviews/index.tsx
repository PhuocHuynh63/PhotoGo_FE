'use client'

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

export default function ReviewsPage({ reviews: initialReviews, pagination: initialPagination }: ReviewsPageProps) {
    //#region define variables
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentPage, setCurrentPage] = useState(initialPagination?.current || 1)
    const [reviews, setReviews] = useState(initialReviews || [])
    const [pagination, setPagination] = useState(initialPagination)
    //#endregion

    //#region data processing
    // Không cần lọc theo comment, hiển thị tất cả review
    //#endregion

    //#region handle pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        const params = new URLSearchParams(searchParams?.toString() || '')
        params.set('page', page.toString())
        router.push(`/profile/reviews?${params.toString()}`)
    }
    //#endregion

    //#region handle review updates
    const handleReviewUpdate = (deletedReviewId?: string) => {
        if (deletedReviewId) {
            const updatedReviews = reviews.filter(review => review.id !== deletedReviewId)
            setReviews(updatedReviews)
            setPagination(prev => ({
                ...prev,
                totalItem: (prev?.totalItem || 0) - 1
            }))
            if (updatedReviews.length === 0 && currentPage > 1) {
                handlePageChange(currentPage - 1)
                return
            }
        }
        router.refresh()
    }
    //#endregion

    return (
        <div className="container mx-auto py-6">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Lịch sử đánh giá</h1>
                <p className="text-muted-foreground">Xem lại các đánh giá bạn đã thực hiện cho các dịch vụ</p>
            </div>

            {/* Review List */}
            <div className="grid gap-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            reviewData={review}
                            onSuccess={() => handleReviewUpdate(review.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Bạn chưa có đánh giá nào</p>
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
        </div>
    )
}

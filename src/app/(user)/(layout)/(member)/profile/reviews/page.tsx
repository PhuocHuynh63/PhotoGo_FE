import { IReviewPaginationResponse, IReviewPaginationResponseModel } from "@models/review/repsonse.model";
import ReviewsPage from "@pages/Member/Profile/Right/Reviews"
import reviewService from "@services/review";
import { getReviewsAction } from "./actions";

async function getReviews(userId: string, current: string, pageSize: string, sortBy: string, sortDirection: string) {
    return await reviewService.getReviewByUserId(userId, current, pageSize, sortBy, sortDirection)
}

export default async function Reviews() {
    // Initial load with default params
    const userId = "5f0667d7-1d15-48df-bc32-0970bb26c840"
    const reviews = await getReviews(userId, "1", "2", "created_at", "desc") as IReviewPaginationResponse
    const reviewsData = reviews.data as IReviewPaginationResponseModel
    
    return (
        <>
            <ReviewsPage 
                reviews={reviewsData.data} 
                pagination={reviewsData.pagination}
                getReviewsAction={getReviewsAction}
            />
        </>
    )
}
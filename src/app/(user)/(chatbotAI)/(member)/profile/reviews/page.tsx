import { authOptions } from "@lib/authOptions";
import { IReviewPaginationResponse, IReviewPaginationResponseModel } from "@models/review/repsonse.model";
import ReviewsPage from "@pages/Member/Profile/Right/Reviews"
import reviewService from "@services/review";
import { METADATA } from "../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";


async function getReviews(userId: string, current: string, pageSize: string, sortBy: string, sortDirection: string) {
    return await reviewService.getReviewByUserId(userId, current, pageSize, sortBy, sortDirection)
}

interface ReviewsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Reviews({ searchParams }: ReviewsPageProps) {
    const session = await getServerSession(authOptions) as METADATA.ISession;

    // Resolve the searchParams promise
    const resolvedParams = await searchParams;

    // Get pagination params from URL
    const page = typeof resolvedParams.page === 'string' ? resolvedParams.page : '1'
    const pageSize = typeof resolvedParams.pageSize === 'string' ? resolvedParams.pageSize : '2'
    const sortBy = typeof resolvedParams.sortBy === 'string' ? resolvedParams.sortBy : 'created_at'
    const sortDirection = typeof resolvedParams.sortDirection === 'string' ? resolvedParams.sortDirection : 'desc'


    const reviews = await getReviews(session.user.id, page, pageSize, sortBy, sortDirection) as IReviewPaginationResponse
    const reviewsData = reviews.data as IReviewPaginationResponseModel
    return (
        <>
            <ReviewsPage
                reviews={reviewsData.data}
                pagination={reviewsData.pagination}
            />
        </>
    )
}
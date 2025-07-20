import http from "@configs/fetch"
import { ICreateReviewModel, IEditReviewModel } from "@models/review/request.model"

const reviewService = {
    getReviewByVendorId: async (
        vendorId: string,
        current?: number,
        pageSize?: number,
        rating?: number,
        sortBy?: string,
        sortDirection?: string,
    ) => {
        const queryParams = new URLSearchParams({
            current: (current || 1).toString(),
            pageSize: (pageSize || 5).toString(),
            sortBy: sortBy || 'created_at',
            sortDirection: sortDirection || 'desc',
        })

        if (rating !== undefined) {
            queryParams.append("rating", rating.toString())
        }

        return await http.get(`/reviews/vendor/${vendorId}?${queryParams.toString()}`, {
            next: { revalidate: 10 },
        })
    },

    getReviewByUserId: async (userId: string, current: string, pageSize: string, sortBy: string, sortDirection: string) => {
        return await http.get(`/reviews/user/${userId}?current=${current}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`, {
            next: { revalidate: 10 },
        })
    },

    createReview: async (review: ICreateReviewModel) => {
        return await http.post(`/reviews`, review)
    },

    editReview: async (reviewId: string, review: IEditReviewModel) => {
        return await http.put(`/reviews/${reviewId}`, review)
    },

    deleteReview: async (reviewId: string) => {
        return await http.delete(`/reviews/${reviewId}`, {})
    }
}

export default reviewService;

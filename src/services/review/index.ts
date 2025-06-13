import http from "@configs/fetch"

const reviewService = {
    getReviewByVendorId: async (
        vendorId: string,
        current: number = 1,
        pageSize: number,
        rating?: number,
        sortBy: string,
        sortDirection: string = 'desc'
    ) => {
        const queryParams = new URLSearchParams({
            current: current.toString(),
            pageSize: pageSize.toString() || '5',
            sortBy: sortBy || 'rating',
            sortDirection,
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
    }
}

export default reviewService;

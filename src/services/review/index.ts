import http from "@configs/fetch"

const reviewService = {
    getReviewByVendorId: async (
        vendorId: string,
        current: number = 1,
        pageSize: number = 10,
        rating?: number,
        sortBy: string = 'rating',
        sortDirection: string = 'desc'
    ) => {
        const queryParams = new URLSearchParams({
            current: current.toString(),
            pageSize: pageSize.toString(),
            sortBy,
            sortDirection,
        })

        if (rating !== undefined) {
            queryParams.append("rating", rating.toString())
        }

        return await http.get(`/reviews/vendor/${vendorId}?${queryParams.toString()}`, {
            next: { revalidate: 10 },
        })
    },
}

export default reviewService;
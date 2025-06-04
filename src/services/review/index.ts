import http from "@configs/fetch"

const reviewService = {
    getReviewVendorByVendorId: async (id: string) => {
        return await http.get(`/reviews/vendor/${id}`, {
            next: { tags: [`review-vendor-${id}`] }
        })
    },
}

export default reviewService
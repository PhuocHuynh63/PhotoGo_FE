import http from "@configs/fetch"

const checkoutSessionService = {
    createCheckSession: async (id: string, userId: string, data: any) => {
        return http.post(`/checkout-session?id=${id}&userId=${userId}`, data)
    },
    getCheckoutSession: async (id: string, userId: string) => {
        return http.get(`/checkout-session?id=${id}&userId=${userId}`)
    },
}

export default checkoutSessionService
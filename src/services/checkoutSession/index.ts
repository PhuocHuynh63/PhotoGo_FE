import http from "@configs/fetch"

const checkoutSessionService = {
    createCheckSession: async (id: string, userId: string, data: any) => {
        return http.post(`/checkout-session?id=${id}&userId=${userId}`, data)
    }
}

export default checkoutSessionService
import http from "@configs/fetch"

const cartService = {
    getCartByUserId: async (userId: string) => {
        return await http.get(`/carts/${userId}/items`, {
            next: { revalidate: 10 }
        })
    },

    addToCart: async (userId: string, cartId: string, serviceConceptId: string) => {
        return await http.post(`/carts/${userId}/${cartId}/${serviceConceptId}/items`, {})
    },
    removeItem: async (cartId: string, itemId: string) => {
        return await http.delete(`/carts/${cartId}/items/${itemId}`, {})
    },
}

export default cartService
import http from "@configs/fetch"

const cartService = {
    getCartByUserId: async (userId: string) => {
        return await http.get(`/carts/${userId}/items`, {
            next: { revalidate: 10 }
        })
    },

}

export default cartService
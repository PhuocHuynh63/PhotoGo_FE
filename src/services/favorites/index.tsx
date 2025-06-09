import http from "@configs/fetch"

const favoritesService = {
    getFavoriteList: async (userId: string) => {
        return await http.get(`/wishlists/user?userId=${userId}`, {
            next: { tags: [`wishlist-${userId}`] }
        })
    },

    addFavorite: async (id: string, data: { serviceConceptId: string }) => {
        return await http.post(`/wishlists/${id}/items`, data)
    },

    removeFavorite: async (id: string, itemId: string) => {
        return await http.delete(`/wishlists/${id}/items/${itemId}`, {})
    }
}

export default favoritesService
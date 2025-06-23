import http from "@configs/fetch"

const favoritesService = {
    getFavoriteList: async (userId: string, queryParams: URLSearchParams = new URLSearchParams()) => {
        return await http.get(`/wishlists/${userId}?${queryParams.toString()}`, {
            next: { tags: [`wishlist-${userId}`] }
        })
    },

    addFavorite: async (wishlistId: string, serviceConceptId: string) => {
        return await http.post(`/wishlists/items`, { wishlistId, serviceConceptId })
    },

    removeFavorite: async (id: string, itemId: string) => {
        return await http.delete(`/wishlists/${id}/items/${itemId}`, { next: { tags: [`wishlist-${id}`] } })
    }
}

export default favoritesService
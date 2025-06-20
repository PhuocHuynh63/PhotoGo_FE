import http from "@configs/fetch"

const favoritesService = {
    getFavoriteList: async (userId: string, queryParams: URLSearchParams) => {
        return await http.get(`/wishlists/${userId}?${queryParams.toString()}`, {
            next: { tags: [`wishlist-${userId}`] }
        })
    },

    addFavorite: async (id: string, data: { serviceConceptId: string }) => {
        return await http.post(`/wishlists/${id}/items`, data, { next: { tags: [`wishlist-${id}`] } })
    },

    removeFavorite: async (id: string, itemId: string) => {
        return await http.delete(`/wishlists/${id}/items/${itemId}`, { next: { tags: [`wishlist-${id}`] } })
    }
}

export default favoritesService
import http from "@configs/fetch"

const categoryService = {
    getCategories: async () => {
        return await http.get(`/categories`)
    },
}

export default categoryService
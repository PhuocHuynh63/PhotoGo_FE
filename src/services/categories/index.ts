import http from "@configs/fetch"

const categoryService = {
    getCategories: async () => {
        return await http.get(`/categories`, {
            next: { revalidate: 10 }
        })
    },
}

export default categoryService
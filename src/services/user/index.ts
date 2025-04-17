import http from "@configs/fetch"

const userService = {
    getUser: async () => {
        return await http.get("/users", {
            next: { revalidate: 10 }
        })
    },
    getAUser: async (id: string) => {
        return await http.get(`/users/${id}`, {
            next: {tags:[`user${id}`]}
        })
    }
}

export default userService
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
    },
    getAUserByEmail: async (email: string) => {
        return await http.get(`/users/email/${email}`, {
            next: {tags:[`user${email}`]}
        })
    },
}

export default userService
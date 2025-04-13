import http from "@configs/fetch"

const userService = {
    getUser: async () => {
        return await http.get("/users", {
            next: { revalidate: 10 }
        })
    },
}

export default userService
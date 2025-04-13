import { axiosClient, axiosPrivate } from "@configs/axios"

const userService = {
    getUser: async () => {
        return await axiosClient.get("/users")
    },
}

export default userService
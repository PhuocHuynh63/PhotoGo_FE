import http from "@configs/fetch"
import { IUserChangePasswordRequest, IUserUpdateProfileRequest } from "@models/user/request.model"

const userService = {
    getUser: async () => {
        return await http.get("/users", {
            next: { revalidate: 10 }
        })
    },
    getAUser: async (id: string) => {
        return await http.get(`/users/${id}`, {
            next: { tags: [`user${id}`] }
        })
    },
    getAUserByEmail: async (email: string) => {
        return await http.get(`/users/email/${email}`, {
            next: { tags: [`user${email}`] }
        })
    },

    updateUser: async (userId: string, data: IUserUpdateProfileRequest) => {
        return await http.put(`/users/${userId}`, data)
    },
    changePassword: async (userId: string, data: IUserChangePasswordRequest) => {
        return await http.put(`/users/${userId}`, data)
    }
}

export default userService
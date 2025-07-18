import http from "@configs/fetch"
import { IAdminGetUsersRequest, IUserChangePasswordRequest, IUserUpdateProfileRequest, IAdminCreateUserRequest } from "@models/user/request.model"
import { IAdminGetUsersResponse } from "@models/user/response.model"


const userService = {
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
    },

    adminCreateUser: async (data: IAdminCreateUserRequest) => {
        return await http.post("/users/create/user", data)
    },

    getUsers: async (params: IAdminGetUsersRequest) => {
        const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
        return await http.get<IAdminGetUsersResponse>(`/users${query}`, {
            cache: 'no-store'
        });
    }
}

export default userService
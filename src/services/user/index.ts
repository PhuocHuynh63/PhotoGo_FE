import http from "@configs/fetch"
import { IAdminGetUsersRequest, IUserChangePasswordRequest, IUserUpdateProfileRequest, IAdminCreateUserRequest } from "@models/user/request.model"
import { IAdminGetUsersResponse, IUserStatisticsResponse } from "@models/user/response.model"


const userService = {
    getAUser: async (id: string) => {
        return await http.get(`/users/${id}`, {
            cache: 'no-store'
        })
    },
    getAUserByEmail: async (email: string) => {
        return await http.get(`/users/email/${email}`, {
            cache: 'no-store'
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
    },

    lockUser: async (userId: string, status: string) => {
        return await http.patch(`/users/${userId}/status`, { status }, {
            cache: 'no-store'
        })
    },

    statisticUser: async (userId: string): Promise<IUserStatisticsResponse> => {
        return await http.get(`/users/statistics/${userId}`, {
            cache: 'no-store'
        })
    }
}

export default userService
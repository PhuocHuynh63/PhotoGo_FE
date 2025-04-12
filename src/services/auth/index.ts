import { axiosClient } from "@configs/axios"
import { IUserLoginRequest } from "@models/user/request.model"

const authService = {
    login: async (data: IUserLoginRequest) => {
        return await axiosClient.post("/auth/login", data)
    },
}

export default authService
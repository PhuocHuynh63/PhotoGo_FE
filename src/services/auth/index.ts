import http from "@configs/fetch"
import { IUserLoginRequest } from "@models/user/request.model"

const authService = {
    login: async (data: IUserLoginRequest) => {
        return await http.post("/auth/login", data)
    },
}

export default authService
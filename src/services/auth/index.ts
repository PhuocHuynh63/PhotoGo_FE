import http from "@configs/fetch"
import { IUserLoginRequest, IUserRegisterRequest } from "@models/user/request.model"

const authService = {
    login: async (data: IUserLoginRequest) => {
        return await http.post("/auth/login", data)
    },
    register: async (data: IUserRegisterRequest) => {
        return await http.post("/auth/register", data)
    },
    sendOtp: async (email: string) => {
        return await http.post(`/mail/send-otp?email=${email}`, {})
    },
    verifyOtp: async (email: string, otp: string) => {
        return await http.post(`/mail/verify-otp?email=${email}&otp=${otp}`, {})
    }
}


export default authService
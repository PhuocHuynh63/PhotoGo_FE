import http from "@configs/fetch"
import { IUserLoginRequest, IUserRegisterRequest, IUserResetPasswordRequest } from "@models/user/request.model"

const authService = {
    login: async (data: IUserLoginRequest) => {
        return await http.post("/auth/login", data)
    },
    register: async (data: IUserRegisterRequest) => {
        return await http.post("/auth/register", data)
    },
    activateAccount: async (email: string, otp: string) => {
        return await http.post(`/auth/activate?email=${email}&otp=${otp}`, {})
    },
    sendOtp: async (email: string) => {
        return await http.post(`/mail/send-otp?email=${email}`, {})
    },
    verifyOtp: async (email: string, otp: string) => {
        return await http.post(`/mail/verify-otp?email=${email}&otp=${otp}`, {})
    },
    resetPassword: async (data: IUserResetPasswordRequest) => {
        return await http.post("/auth/reset-password", data)
    },
}


export default authService
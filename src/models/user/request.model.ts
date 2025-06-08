import { z } from "zod";
/**
 * UserModel is a Model for User Login request
 * @param email - Email of user
 * @param password - Password of user
 */
export const UserLoginRequest = z.object({
    email: z.string().min(1, 'Email không được bỏ trống').email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})
export type IUserLoginRequest = z.TypeOf<typeof UserLoginRequest>;
//----------------------End----------------------//

/**
 * UserModel is a Model for User Register request
 * @param email - Email of user
 * @param password - Password of user
 */
export const UserRegisterRequest = z.object({
    fullName: z.string().min(1, 'Họ tên không được bỏ trống').max(50, 'Họ tên không được quá 50 ký tự'),
    email: z.string().min(1, 'Email không được bỏ trống').email('Email không đúng định dạng'),
    passwordHash: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    phoneNumber: z.string()
        .min(10, { message: "Số điện thoại phải từ 10 đến 11 ký tự" })
        .max(11, { message: "Số điện thoại phải từ 10 đến 11 ký tự" }),
})
export type IUserRegisterRequest = z.TypeOf<typeof UserRegisterRequest>;
//----------------------End----------------------//

/**
 * UserModel is a Model for User Forgot request
 * @param email - Email of user
 */
export const UserForgotPasswordRequest = z.object({
    email: z.string().min(1, 'Email không được bỏ trống').email('Email không đúng định dạng'),
})
export type IUserForgotPasswordRequest = z.TypeOf<typeof UserForgotPasswordRequest>;
//----------------------End----------------------//

/**
 * UserModel is a Model for User OTP request
 * @param email - Email of user
 */
export const UserOTPRequest = z.object({
    email: z.string().min(1, 'Email không được bỏ trống').email('Email không đúng định dạng'),
    otp: z.string().length(6, 'Mã OTP phải gồm 6 ký tự'),
})
export type IUserOTPRequest = z.TypeOf<typeof UserOTPRequest>;
//----------------------End----------------------//


export const UserResetPasswordRequest = z.object({
    otp: z.string().length(6, 'Mã OTP phải gồm 6 ký tự'),
    email: z.string().min(1, 'Email không được bỏ trống').email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu không được bỏ trống'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
})
export type IUserResetPasswordRequest = z.TypeOf<typeof UserResetPasswordRequest>;
//----------------------End----------------------//

export const UserUpdateProfileRequest = z.object({
    fullName: z.string().min(1, 'Họ tên không được bỏ trống').max(50, 'Họ tên không được quá 50 ký tự'),
    phoneNumber: z.string().min(10, 'Không đúng định dạng số điện thoại').max(11, 'Không đúng định dạng số điện thoại'),
})
export type IUserUpdateProfileRequest = z.TypeOf<typeof UserUpdateProfileRequest>;
//----------------------End----------------------//

/**
 * UserModel is a Model for User Change Password request
 * @param oldPassword - Old password of user
 * @param newPassword - New password of user
 */
export const UserChangePasswordRequest = z.object({
    oldPasswordHash: z.string().min(1, 'Mật khẩu cũ không được bỏ trống'),
    password: z.string().min(1, 'Mật khẩu mới không được bỏ trống'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu không được bỏ trống'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
})
export type IUserChangePasswordRequest = z.TypeOf<typeof UserChangePasswordRequest>;
//----------------------End----------------------//
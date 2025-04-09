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
    fullname: z.string().min(1, 'Họ tên không được bỏ trống').max(50, 'Họ tên không được quá 50 ký tự'),
    email: z.string().min(1, 'Email không được bỏ trống').email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    phone: z.string()
        .min(10, { message: "Số điện thoại phải từ 10 đến 11 ký tự" })
        .max(11, { message: "Số điện thoại phải từ 10 đến 11 ký tự" }),
})
export type IUserRegisterRequest = z.TypeOf<typeof UserRegisterRequest>;
//----------------------End----------------------//
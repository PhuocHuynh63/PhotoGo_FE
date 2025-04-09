import { z } from "zod";
/**
 * UserModel is a Model for User response
 */
export const UserLoginRequest = z.object({
    email: z.string().min(1, 'Email không được bỏ trống').email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})
export type IUserLoginRequest = z.TypeOf<typeof UserLoginRequest>;
//----------------------End----------------------//
import { z } from "zod";
import { BackendResponseModel } from "../backend/backendResponse.model";
import { PaginationModel } from "../metadata";
import { UserModel } from "./common.model";

/**
 * UserModel is a Model for Users response
 */
export const UsersModelResponse = z.object({
    meta: PaginationModel,
    results: z.array(UserModel),
})
export const Users = BackendResponseModel(UsersModelResponse);
export type IUsersResponse = z.TypeOf<typeof Users>
//----------------------End----------------------//

/**
 * UserModel is a Model for User response
 */
export const User = BackendResponseModel(UserModel);
export type IUserResponse = z.TypeOf<typeof User>;
//----------------------End----------------------//


/**
 * UserModel is a Model for User Resigster response
 */
export const UserRegisterModelResponse = UserModel
export const UserRegister = BackendResponseModel(UserRegisterModelResponse);
export type IUserRegisterResponse = z.TypeOf<typeof UserRegister>
//----------------------End----------------------//

/**
 * UserModel is a Model for User Update response
 */
export const UserUpdateModelResponse = z.object({
    data: UserModel,
    message: z.string(),
    statusCode: z.number()
})
export const UserUpdate = BackendResponseModel(UserUpdateModelResponse);
export type IUserUpdateResponse = z.TypeOf<typeof UserUpdate>
//----------------------End----------------------//

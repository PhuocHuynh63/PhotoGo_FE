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

import { z } from "zod";
import { BackendResponseModel } from "../backend/backendResponse.model";
import { PaginationModel } from "../metadata";
import { UserModel } from "./common.model";

/**
 * UserModel is a Model for User response
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
export const UserModelResponse = z.object({
    data: UserModel,
})
export const User = BackendResponseModel(UserModelResponse);
export type IUserResponse = z.TypeOf<typeof User>
//----------------------End----------------------//


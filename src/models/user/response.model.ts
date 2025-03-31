import { z } from "zod";
import { BackendResponseModel } from "../backend/backendResponse.model";
import { PaginationModel } from "../metadata";
import { UserModel } from "./common.model";

/**
 * UserModel is a Model for User response
 */
export const UserModelResponse = z.object({
    meta: PaginationModel,
    results: z.array(UserModel),
})
export const User = BackendResponseModel(UserModelResponse);
export type IUser = z.TypeOf<typeof User>
//----------------------End----------------------//
import { RoleModel } from './../role/common.model';
import { z } from "zod";

/**
 * Model of User
 */
export const UserModel = z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    phoneNumber: z.number().optional(),
    avatarUrl: z.string().optional(),
    auth: z.string().optional(),
    note: z.string().optional(),
    createdAt: z.string(),
    lastLoginAt: z.string(),
    role: RoleModel,
    rank: z.string(),
    status: z.string(),
    subscription: z.string().optional(),
    updatedAt: z.string(),
})
export type IUser = z.TypeOf<typeof UserModel>
//----------------------End----------------------//
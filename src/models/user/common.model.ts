import { z } from "zod";

/**
 * Model of User
 */
export const UserModel = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string().optional(),
})
export type IUser = z.TypeOf<typeof UserModel>
//----------------------End----------------------//
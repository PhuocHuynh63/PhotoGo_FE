import { z } from "zod";

/**
 * Model of User
 */
export const RoleModel = z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
})
export type IRole = z.TypeOf<typeof RoleModel>
//----------------------End----------------------//
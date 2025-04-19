import { z } from "zod";

/**
 * Model of User
 */
export const CategoryModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
});
export type ICategory = z.TypeOf<typeof CategoryModel>
//----------------------End----------------------//

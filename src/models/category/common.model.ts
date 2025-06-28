import { z } from "zod";

/**
 * Model of Category
 */
export const CategoryModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    isPublic: z.boolean().optional(),
});
export type ICategory = z.TypeOf<typeof CategoryModel>
//----------------------End----------------------//



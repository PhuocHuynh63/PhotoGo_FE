import { LocationModel } from './../location/common.model';
import { CategoryModel } from './../category/common.model';
import { z } from "zod";

/**
 * Model of User
 */
export const VendorModel = z.array(z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    logo: z.string(),
    banner: z.string(),
    image_url: z.string(),
    status: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    category: CategoryModel,
    locations: z.array(LocationModel),
}));
export type IVendor = z.TypeOf<typeof VendorModel>
//----------------------End----------------------//
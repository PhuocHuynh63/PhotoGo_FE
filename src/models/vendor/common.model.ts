import { CategoryModel } from "@models/category/common.model";
import { LocationModel } from "@models/location/common.model";
import { ReviewModel } from "@models/review/common.model";
import { ServicePackageModel } from "@models/servicePackages/common.model";
import { UserModel } from "@models/user/common.model";
import { z } from "zod";

/**
 * Model of Vendor
 */
export const VendorModel = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    distance: z.number().optional(),
    logo: z.string().nullable(),
    banner: z.string().nullable(),
    status: z.string(),
    category: CategoryModel.optional(),
    locations: z.array(LocationModel),
    servicePackages: z.array(ServicePackageModel),
    averageRating: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    reviews: z.array(ReviewModel),
    isRemarkable: z.boolean(),
    minPrice: z.number(),
    maxPrice: z.number(),
    user_id: UserModel,
});
export type IVendor = z.TypeOf<typeof VendorModel>;

//----------------------End----------------------//

/**
 * Model of Vendor By ID
 */
export const VendorByIdModel = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    logo: z.string().nullable(),
    banner: z.string().nullable(),
    status: z.string(),
    category: CategoryModel.optional(),
    locations: z.array(LocationModel),
    servicePackages: z.array(ServicePackageModel),
    averageRating: z.number(),
    totalPrice: z.number(),
    user_id: UserModel,
});

export type IVendorById = z.TypeOf<typeof VendorByIdModel>;
//----------------------End----------------------//
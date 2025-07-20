import { CategoryModel } from "@models/category/common.model";
import { LocationModel } from "@models/location/common.model";
import { ReviewModel } from "@models/review/common.model";
import { ServicePackageModel } from "@models/servicePackages/common.model";
import { UserModel } from "@models/user/common.model";
import { z } from "zod";

/**
 * Model của Contact
 */
export const ContactModel = z.object({
    phone: z.string(),
    email: z.string(),
});

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

/**
 * Model of Vendor List Item 
 */
export const VendorListItemModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    logo: z.string().nullable(),
    banner: z.string().nullable(),
    status: z.string(),
    slug: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    priority: z.number(),
    averageRating: z.number(),
    reviewCount: z.number(),
    packageCount: z.number(),
    branchCount: z.number(),
    orderCount: z.number(),
    category: CategoryModel.optional(),
    contact: ContactModel,
});
export type IVendorListItem = z.TypeOf<typeof VendorListItemModel>;

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

export const VendorOfCampaignModel = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    logo: z.string().nullable(),
    banner: z.string().nullable(),
    status: z.string(),
    priority: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
});

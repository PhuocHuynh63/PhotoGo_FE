import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { CategoryModel } from "@models/category/common.model";
import { LocationModel } from "@models/location/common.model";
import { ReviewModel } from "@models/review/common.model";
import { ServicePackageModel } from "@models/servicePackages/common.model";
import { z } from "zod";

/**
 * Model of Vendor
 */
export const VendorModel = z.object({
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
    reviews: z.array(ReviewModel),
    created_at: z.string(),
    updated_at: z.string(),
});

export type IVendor = z.TypeOf<typeof VendorModel>;
//----------------------End----------------------//
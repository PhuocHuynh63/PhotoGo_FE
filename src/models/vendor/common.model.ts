import { z } from "zod";

const LocationModel = z.object({
    id: z.string(),
    address: z.string(),
    district: z.string(),
    ward: z.string(),
    city: z.string(),
    province: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

const ServicePackageModel = z.object({
    id: z.string(),
    vendorId: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.string(),
    duration: z.number(),
    status: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

const ReviewModel = z.object({
    id: z.string(),
    userId: z.string(),
    vendorId: z.string(),
    bookingId: z.string(),
    rating: z.number(),
    comment: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

/**
 * Model of User
 */
export const VendorModel = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    logo: z.string().nullable(),
    banner: z.string().nullable(),
    status: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    locations: z.array(LocationModel),
    servicePackages: z.array(ServicePackageModel),
    reviews: z.array(ReviewModel)
});

export type IVendor = z.infer<typeof VendorModel>;
export type ILocation = z.infer<typeof LocationModel>;
export type IServicePackage = z.infer<typeof ServicePackageModel>;
export type IReview = z.infer<typeof ReviewModel>;
//----------------------End----------------------//
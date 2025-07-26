import { z } from "zod"

/**
 * Model of Review
 */
export const ReviewModel = z.object({
    id: z.string().uuid(),
    user_id: z.string(),
    vendor_id: z.string(),
    booking_id: z.string(),
    rating: z.number().min(0).max(5),
    comment: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type IReviewModel = z.infer<typeof ReviewModel>;
//----------------------End----------------------//

/**
 * Model of Review Vendor Detail
 */
export const ReviewVendorDetailModel = z.object({
    id: z.string().uuid(),
    user: z.object({
        id: z.string().uuid(),
        fullName: z.string(),
        avatarUrl: z.string().optional(),
    }),
    vendor: z.object({
        id: z.string().uuid(),
        name: z.string(),
        logoUrl: z.string().optional(),
        bannerUrl: z.string().optional(),
        description: z.string().optional(),
        status: z.string(),
    }),
    rating: z.number().min(0).max(5),
    comment: z.string().optional(),
    createdAt: z.string(),
    images: z.array(z.string()).optional(),
    booking: z.object({ id: z.string().uuid() }),
});
export type IReviewVendorDetailModel = z.infer<typeof ReviewVendorDetailModel>;
//----------------------End----------------------//

/**
 * Model of Review All
 */
export const ReviewAllModel = z.object({
    id: z.string().uuid(),
    comment: z.string(),
    rating: z.number().min(1).max(5),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    user: z.object({
        id: z.string().uuid(),
        fullName: z.string(),
        avatarUrl: z.string(),
    }),
    booking: z.object({
        id: z.string().uuid(),
    }),
    images: z.array(z.any()),
    vendor: z.object({
        id: z.string().uuid(),
        name: z.string(),
        logoUrl: z.string().url(),
        bannerUrl: z.string().url(),
        description: z.string(),
    }),
});
export type IReviewAllModel = z.infer<typeof ReviewAllModel>;
//----------------------End----------------------//
import { UserModel } from "@models/user/common.model";
import { VendorModel } from "@models/vendor/common.model";
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

export type IReview = z.infer<typeof ReviewModel>;
//----------------------End----------------------//

/**
 * Model of Review Image
 */
export const ReviewImageModel = z.object({
    id: z.string().uuid(),
    imageUrl: z.string(),
});
export type IReviewImageModel = z.infer<typeof ReviewImageModel>;
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
    images: z.array(ReviewImageModel).optional(),
    booking: z.object({ id: z.string().uuid() }),
});
export type IReviewVendorDetailModel = z.infer<typeof ReviewVendorDetailModel>;
//----------------------End----------------------//

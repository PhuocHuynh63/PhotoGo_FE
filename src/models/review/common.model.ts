import { UserModel } from "@models/user/common.model";
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

// export const ReviewVendorDetail = z.object({
//     id: z.string().uuid(),
//     user: UserModel,

import { z } from "zod"

/**
 * Model of Review
 */
export const ReviewModel = z.object({
    id: z.string(),
    userId: z.string(),
    vendorId: z.string(),
    bookingId: z.string(),
    rating: z.number(),
    comment: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type IReview = z.infer<typeof ReviewModel>;
//----------------------End----------------------//
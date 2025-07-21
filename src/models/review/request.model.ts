import { z } from "zod"

/**
 * * Create Review Model
 */
export const CreateReviewModel = z.object({
    userId: z.string(),
    rating: z.number().min(0).max(5),
    comment: z.string().optional(),
    vendorId: z.string(),
    bookingId: z.string(),
})
export type ICreateReviewModel = z.infer<typeof CreateReviewModel>;
//------------------------End------------------------//

/**
 * * Edit Review Model
 */
export const EditReviewModel = z.object({
    rating: z.number().min(0).max(5),
    comment: z.string().optional(),
    bookingId: z.string(),
    vendorId: z.string(),
    images: z.array(z.string()).optional(),
})

export type IEditReviewModel = z.infer<typeof EditReviewModel>;
//------------------------End------------------------//

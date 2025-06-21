import { z } from "zod"

export const EditReviewModel = z.object({
    rating: z.number().min(0).max(5),
    comment: z.string().optional(),
    bookingId: z.string(),
    vendorId: z.string(),
    images: z.array(z.string()).optional(),
})

export type IEditReviewModel = z.infer<typeof EditReviewModel>;

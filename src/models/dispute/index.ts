
import { z } from "zod";

/**
 * Model of Dispute
 */
export const DisputeModel = z.array(z.object({
    id: z.string(),
    bookingId: z.string(),
    reason: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
}))

export type IDispute = z.TypeOf<typeof DisputeModel>
//----------------------End----------------------//

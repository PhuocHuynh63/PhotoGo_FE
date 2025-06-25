
import { z } from "zod";

/**
 * Model of History
 */
export const HistoryModel = z.array(z.object({
    id: z.string(),
    bookingId: z.string(),
    status: z.string(),
    changedAt: z.string(),
}))

export type IHistory = z.TypeOf<typeof HistoryModel>
//----------------------End----------------------//

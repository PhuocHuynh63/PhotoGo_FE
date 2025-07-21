import { z } from "zod";

/**
 * PaymentRequest is a Model for Payment request
 * @param locationId - Location ID
 * @param startDate - Start Date
 * @param endDate - End Date
 * @param type - Type
 */
export const IVendorOverviewRequest = z.object({
    locationId: z.string().min(1, "Location ID là bắt buộc"),
    startDate: z.string().min(1, "Start Date là bắt buộc"),
    endDate: z.string().min(1, "End Date là bắt buộc"),
    type: z.enum(["finance", "booking", "subscription"]),
})
export type IVendorOverviewRequest = z.TypeOf<typeof IVendorOverviewRequest>;
//----------------------End----------------------//

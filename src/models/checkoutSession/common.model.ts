import { z } from "zod";

/**
 * Model of CheckoutSession
 */

export const CheckoutSessionModel = z.object({
    checkoutSessionId: z.string(),
    userId: z.string(),
    conceptRangeType: z.enum(['một ngày', 'nhiều ngày', '']),
    singleDayBookingDetails: z.object({
        date: z.string(),
        time: z.string(),
        working_date_id: z.string(),
        slot_time_id: z.string(),
        duration: z.number(),
    }),
    multiDaysBookingDetails: z.array(z.string()).optional(),
    conceptId: z.string(),
    price: z.number(),
    vendorDetails: z.object({
        id: z.string(),
        name: z.string(),
    }),
    locationDetails: z.object({
        id: z.string(),
        address: z.string(),
    }),
});

export type ICheckoutSession = z.infer<typeof CheckoutSessionModel>;
//----------------------End----------------------//
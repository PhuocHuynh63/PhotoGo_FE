import { z } from "zod";

export const BookingFormRequest = z.object({
    userId: z.string(),
    service_concept_id: z.string(),
    date: z.string(),
    time: z.string(),
    source_type: z.enum(["web", "app", "facebook", "titok"], {
        errorMap: () => ({ message: "Source type must be one of web, app, facebook, or titok" }),
    }),
    deposit: z.number(),
    method: z.enum(["payos"], {
        errorMap: () => ({ message: "Payment method is required" }),
    }),
    fullName: z.string(),
    phone: z.string(),
    email: z.string().email("Invalid email format"),
    userNote: z.string().optional(),
})
export type IBookingFormRequest = z.TypeOf<typeof BookingFormRequest>;
import { z } from "zod";

export const BookingFormRequest = z.object({
    userId: z.string().nonempty("User ID is required"),
    service_concept_id: z.string().nonempty("Service concept ID is required"),
    data: z.string().nonempty("Date is required"),
    time: z.string().nonempty("Time is required"),
    source_type: z.enum(["web", "app", "facebook", "titok"], {
        errorMap: () => ({ message: "Source type must be one of web, app, facebook, or titok" }),
    }),
    deposit: z.number(),
    method: z.enum(["payos"], {
        errorMap: () => ({ message: "Payment method is required" }),
    }),
    fullName: z.string().nonempty("Full name is required"),
    phone: z.string().nonempty("Phone number is required"),
    email: z.string().email("Invalid email format").nonempty("Email is required"),
    user_note: z.string().optional(),
})
export type IBookingFormRequest = z.TypeOf<typeof BookingFormRequest>;
import { z } from "zod";

export const BookingFormRequest = z.object({
    userId: z.string(),
    serviceConceptId: z.string(),
    date: z.string(),
    time: z.string(),
    sourceType: z.enum(["trực tiếp", "chiến dịch", "giới thiệu", "nổi bật", "khuyến mãi", "khác"], {
        errorMap: () => ({ message: "Source type must be one of web, app, facebook, or titok" }),
    }),
    depositAmount: z.number(),
    // method: z.enum(["payos"], {
    //     errorMap: () => ({ message: "Payment method is required" }),
    // }),
    fullName: z.string(),
    phone: z.string(),
    email: z.string().email("Invalid email format"),
    userNote: z.string().optional(),
})
export type IBookingFormRequest = z.TypeOf<typeof BookingFormRequest>;
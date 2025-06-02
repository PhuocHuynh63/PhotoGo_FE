import { z } from "zod";

/**
 * Model of User
 */
export const BookingModel = z.object({
    id: z.string(),
    userId: z.string(),
    vendorId: z.string(),
    service_concept_id: z.string(),
    date: z.string(),
    time: z.string(),
    status: z.enum(["Chờ xử lý", "Đã xác nhận", "Đã hoàn thành", "Đã hủy"]),
    source_type: z.enum(["web", "app", "facebook", "titok"]),
    deposit: z.number(),
    userNote: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});
export type IBooking = z.TypeOf<typeof BookingModel>
//----------------------End----------------------//

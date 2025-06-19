
import { z } from "zod";

/**
 * Model of Booking
 */
export const BookingModel = z.object({
    id: z.string(),
    userId: z.string(),
    vendorId: z.string(),
    serviceConceptId: z.string(),
    date: z.string(),
    time: z.string(),
    status: z.enum(["chờ xử lý", "đã xác nhận", "đã hoàn thành", "đã hủy", "chờ thanh toán"]),
    sourceType: z.enum(["trực tiếp", "chiến dịch", "giới thiệu", "nổi bật", "khuyến mãi", "khác"]),
    sourceId: z.string().nullable(),
    depositAmount: z.string(),
    depositType: z.string(),
    email: z.string().email(),
    fullName: z.string(),
    phone: z.string(),
    histories: z.array(z.any()),
    userNote: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        passwordHash: z.string(),
        oldPasswordHash: z.string(),
        fullName: z.string(),
    }).optional(),
});

export type IBooking = z.TypeOf<typeof BookingModel>
//----------------------End----------------------//

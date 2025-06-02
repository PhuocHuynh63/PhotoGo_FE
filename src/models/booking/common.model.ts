import { z } from "zod";

/**
 * Model of User
 */
export const BookingModel = z.object({
    id: z.string(),
    userId: z.string(),
    vendorId: z.string(),
    serviceConceptId: z.string(),
    date: z.string(),
    time: z.string(),
    status: z.enum(["Chờ xử lý", "Đã xác nhận", "Đã hoàn thành", "Đã hủy"]),
    sourceType: z.enum(["trực tiếp", "chiến dịch", "giới thiệu", "nổi bật", "khuyến mãi", "khác"]),
    depositAmount: z.number(),
    userNote: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});
export type IBooking = z.TypeOf<typeof BookingModel>
//----------------------End----------------------//

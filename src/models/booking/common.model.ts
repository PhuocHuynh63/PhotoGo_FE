
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

/**
 * Model of Booking Detail
 */
export const BookingDetailModel = z.object({
    id: z.string(),
    userId: z.string(),
    locationId: z.string(),
    serviceConceptId: z.string(),
    date: z.string(), // Format: DD/MM/YYYY
    time: z.string(),
    status: z.string(),
    sourceType: z.string(),
    sourceId: z.string().nullable(),
    depositAmount: z.string(),
    depositType: z.string(),
    userNote: z.string(),
    fullName: z.string(),
    phone: z.string(),
    email: z.string(),
    code: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        passwordHash: z.string(),
        oldPasswordHash: z.string().nullable(),
        fullName: z.string(),
        phoneNumber: z.string(),
        avatarUrl: z.string(),
        status: z.string(),
        rank: z.string(),
        multiplier: z.string(),
        note: z.string().nullable(),
        auth: z.string(),
        lastLoginAt: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
    }),
    serviceConcept: z.object({
        id: z.string(),
        servicePackageId: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.string(),
        duration: z.number(),
        status: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        servicePackage: z.object({
            id: z.string(),
            vendorId: z.string(),
            name: z.string(),
            description: z.string(),
            image: z.string(),
            status: z.string(),
            created_at: z.string(),
            updated_at: z.string(),
        }),
    }),
    histories: z.array(z.object({
        id: z.string(),
        bookingId: z.string(),
        status: z.string(),
        changedAt: z.string(),
    })),
    invoices: z.array(z.object({
        id: z.string(),
        bookingId: z.string(),
        originalPrice: z.number(),
        discountAmount: z.number(),
        discountedPrice: z.number(),
        taxAmount: z.number(),
        feeAmount: z.number(),
        payablePrice: z.number(),
        depositAmount: z.number(),
        remainingAmount: z.number(),
        paidAmount: z.number(),
        status: z.string(),
        issuedAt: z.string(),
        updatedAt: z.string(),
    })),
    disputes: z.array(z.object({
        id: z.string(),
        bookingId: z.string(),
        reason: z.string(),
        status: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })),
    payablePrice: z.number(),
});

export type IBookingDetail = z.TypeOf<typeof BookingDetailModel>

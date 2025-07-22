
import { BOOKING } from "@constants/booking";
import { InvoiceModel } from "@models/invoice/common.model";
import { LocationModel } from "@models/location/common.model";
import { UserModel } from "@models/user/common.model";
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
    status: z.enum([
        BOOKING.BOOKING_STATUS.NOT_PAID,
        BOOKING.BOOKING_STATUS.PAID,
        BOOKING.BOOKING_STATUS.PENDING,
        BOOKING.BOOKING_STATUS.CONFIRMED,
        BOOKING.BOOKING_STATUS.IN_PROGRESS,
        BOOKING.BOOKING_STATUS.COMPLETED,
        BOOKING.BOOKING_STATUS.CANCELLED,
        BOOKING.BOOKING_STATUS.CANCELLED_TIMEOUT,
        BOOKING.BOOKING_STATUS.CANCELLED_USER,
        BOOKING.BOOKING_STATUS.CANCELLED_VENDOR,
    ]),
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
    isReview: z.boolean().optional(),
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
    location: LocationModel.optional(),
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
    user: UserModel,
    serviceConcept: z.object({
        id: z.string(),
        servicePackageId: z.string(),
        name: z.string(),
        conceptRangeType: z.enum(["một ngày", "nhiều ngày"]),
        numberOfDays: z.number(),
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
    invoices: z.array(InvoiceModel),
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
//----------------------End----------------------//


/**
 * Model of Booking Discount Amount
 */
export const BookingDiscountAmount = z.object({
    finalPrice: z.number(),
    discount: z.number(),
    depositAmount: z.number(),
    remainingAmount: z.number(),
    rushFee: z.number(),
    totalPayable: z.number(),
})

export type IBookingDiscountAmount = z.TypeOf<typeof BookingDiscountAmount>
//----------------------End----------------------//

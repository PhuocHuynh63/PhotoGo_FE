import { z } from "zod";

/**
 * Booking form request schema
 * This schema defines the structure of the booking form request.
 */
export const BookingFormRequest = z.object({
    userId: z.string(),
    serviceConceptId: z.string(),
    date: z.string(),
    time: z.string(),
    sourceType: z.enum(["trực tiếp", "chiến dịch", "giới thiệu", "nổi bật", "khuyến mãi", "khác"], {
        errorMap: () => ({ message: "Source type must be one of web, app, facebook, or titok" }),
    }),
    locationId: z.string(),
    depositAmount: z.number(),
    // method: z.enum(["payos"], {
    //     errorMap: () => ({ message: "Payment method is required" }),
    // }),
    fullName: z.string(),
    phone: z.string(),
    email: z.string().email("Invalid email format"),
    userNote: z.string().optional(),
    voucherId: z.string()
})
export type IBookingFormRequest = z.TypeOf<typeof BookingFormRequest>;
//----------------------------End-----------------------------//


/**
 * Checkout session request schema
 * This schema defines the structure of the checkout session request.
 * It includes details about the price, vendor, location, concept, and booking details.
 */
export const CheckoutSessionRequest = z.object({
    conceptRangeType: z.enum(['một ngày', 'nhiều ngày', '']),
    price: z.number(),
    vendorDetails: z.object({
        id: z.string(),
        name: z.string(),
    }),
    locationDetails: z.object({
        id: z.string(),
        address: z.string(),
    }),
    conceptId: z.string(),
    singleDayBookingDetails: z.object({
        working_date_id: z.string(),
        slot_time_id: z.string(),
        date: z.string(),
        dates: z.array(z.string()).optional(),
        time: z.string(),
        duration: z.number(),
    }).optional(),
    multiDaysBookingDetails: z.array(z.string()).optional(),
});
export type ICheckoutSessionRequest = z.TypeOf<typeof CheckoutSessionRequest>;
//----------------------------End-----------------------------//
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
//----------------------------End-----------------------------//


/**
 * Checkout session request schema
 * This schema defines the structure of the checkout session request.
 * It includes details about the price, vendor, location, concept, and booking details.
 */
export const CheckoutSessionRequest = z.object({
    price: z.number(),
    vendorDetails: z.object({
        id: z.string(),
        name: z.string(),
    }),
    locationDetails: z.object({
        id: z.string(),
        address: z.string(),
    }),
    concept: z.object({
        id: z.string(),
        name: z.string(),
    }),
    bookingDetails: z.object({
        working_date_id: z.string(),
        slot_time_id: z.string(),
        date: z.string(),
        time: z.string(),
        duration: z.number(),
    }),
});
export type ICheckoutSessionRequest = z.TypeOf<typeof CheckoutSessionRequest>;
//----------------------------End-----------------------------//
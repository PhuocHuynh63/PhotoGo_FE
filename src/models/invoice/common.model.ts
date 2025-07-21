import { BOOKING } from "@constants/booking";
import { BookingDetailModel } from "@models/booking/common.model";
import { PaymentModel } from "@models/payment/common.model";
import { z } from "zod";

/**
 * Model of Invoice
 */
const bookingStatusValues = Object.values(BOOKING.BOOKING_STATUS)

export const InvoiceModel = z.object({
    id: z.string(),
    bookingId: z.string(),
    voucherId: z.string(),
    originalPrice: z.number(),
    discountAmount: z.number(),
    discountedPrice: z.number(),
    taxAmount: z.number(),
    feeAmount: z.number(),
    isReview: z.boolean(),
    payablePrice: z.number(),
    depositAmount: z.number(),
    remainingAmount: z.number(),
    paidAmount: z.number(),
    status: z.enum(bookingStatusValues as [string, ...string[]]).optional(),
    issuedAt: z.string(),
    updatedAt: z.string(),
    booking: z.any(),
    payments: z.any().optional(),
});

export type IInvoiceModel = z.TypeOf<typeof InvoiceModel>
//----------------------End----------------------//

/*
* Invoice Statistics Models
*/
export const InvoiceStatisticsModel = z.object({
    pendingInvoices: z.number(),
    partiallyPaidInvoices: z.number(),
    paidInvoices: z.number(),
    cancelledInvoices: z.number(),
});
//----------------------End----------------------//
import { BookingModel } from "@models/booking/common.model";
import { PaymentModel } from "@models/payment/common.model";
import { z } from "zod";

/**
 * Model of Invoice
 */
export const InvoiceModel = z.object({
    id: z.string(),
    bookingId: z.string(),
    originalPrice: z.number(),
    discountAmount: z.number(),
    discountedPrice: z.number(),
    taxAmount: z.number(),
    feeAmount: z.number(),
    payablePrice: z.number(),
    paidAmount: z.number(),
    depositAmount: z.number(),
    remainingAmount: z.number(),
    status: z.string(),
    issuedAt: z.string(),
    updatedAt: z.string(),
    payments: z.array(PaymentModel),
    refunds: z.array(z.object({})), // You might want to define a detailed refund model
    booking: BookingModel
});

export type IInvoice = z.TypeOf<typeof InvoiceModel>
//----------------------End----------------------//

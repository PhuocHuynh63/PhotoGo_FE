import { z } from "zod";

/**
 * Model of Payment
 */
export const PaymentModel = z.object({
    id: z.string(),
    invoiceId: z.string(),
    amount: z.string(),
    paymentOSId: z.string(),
    paymentMethod: z.string(),
    status: z.string(),
    type: z.string(),
    transactionId: z.string(),
    description: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type IPayment = z.TypeOf<typeof PaymentModel>;

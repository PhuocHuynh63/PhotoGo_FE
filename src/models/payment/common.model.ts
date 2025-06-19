import { z } from "zod";

/**
 * Model of Payment
 */
export const PaymentModel = z.object({
    id: z.string(),
    amount: z.number(),
    method: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type IPayment = z.TypeOf<typeof PaymentModel>;

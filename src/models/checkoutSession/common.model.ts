import { z } from "zod";

/**
 * Model of CheckoutSession
 */

export const CheckoutSessionModel = z.object({
    conceptId: z.string(),
    date: z.string(),
    time: z.string(),    
});

export type ICheckoutSession = z.infer<typeof CheckoutSessionModel>;
//----------------------End----------------------//
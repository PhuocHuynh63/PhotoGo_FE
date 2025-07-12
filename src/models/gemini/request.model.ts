import { z } from "zod";

/**
 * PaymentRequest is a Model for Payment request
 * @param status - Status of payment
 * @param code - Code of payment
 * @param id - PayOS ID of payment
 * @param cancel - Cancel of payment
 * @param orderCode - Order Code of payment
 */
export const GeminiRequest = z.object({
    file: z.any(),
    prompt: z.string().optional(),
})
export type IGeminiRequest = z.TypeOf<typeof GeminiRequest>;
//----------------------End----------------------//

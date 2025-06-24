import { z } from "zod";

/**
 * PaymentRequest is a Model for Payment request
 * @param status - Status of payment
 * @param code - Code of payment
 * @param id - PayOS ID of payment
 * @param cancel - Cancel of payment
 * @param orderCode - Order Code of payment
 */
export const PaymentRequest = z.object({
    status: z.string().min(1, "Status là bắt buộc"),
    code: z.string().min(1, "Code là bắt buộc"),
    id: z.string().min(1, "PayOS ID là bắt buộc"),
    cancel: z.boolean(),
    orderCode: z.string().min(1, "Order Code là bắt buộc"),
})
export type IPaymentRequest = z.TypeOf<typeof PaymentRequest>;
//----------------------End----------------------//

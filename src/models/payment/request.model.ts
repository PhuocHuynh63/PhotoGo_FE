import { z } from "zod";

/**
 * UserModel is a Model for User Login request
 * @param email - Email of user
 * @param password - Password of user
 */
export const PaymentErrorRequest = z.object({
    paymentId: z.string().min(1, "Payment ID là bắt buộc"),
    status: z.string().min(1, "Status là bắt buộc"),
    code: z.string().min(1, "Code là bắt buộc"),
    id: z.string().min(1, "PayOS ID là bắt buộc"),
    cancel: z.string().min(1, "Cancel là bắt buộc"),
    orderCode: z.string().min(1, "Order Code là bắt buộc"),
})
export type IPaymentErrorRequest = z.TypeOf<typeof PaymentErrorRequest>;
//----------------------End----------------------//

import { z } from "zod";

/**
 * Model of SubscriptionPlanRequest
 */
export const SubscriptionPlanRequestModel = z.object({
    name: z.string(),
    description: z.string(),
    priceForMonth: z.number(),
    priceForYear: z.number(),
    isActive: z.boolean(),
    planType: z.enum(["người dùng", "nhà cung cấp"]),
    billingCycle: z.enum(["hàng tháng", "hàng năm"]),
});

export type ISubscriptionPlanRequestModel = z.infer<typeof SubscriptionPlanRequestModel>;
//----------------------End----------------------//


/**
 * Model of SubscriptionCreatePaymentLinkRequest
 */
export const SubscriptionCreatePaymentLinkRequestModel = z.object({
    planId: z.string(),
    userId: z.string(),
    type: z.string(),
});

export type ISubscriptionCreatePaymentLinkRequestModel = z.infer<typeof SubscriptionCreatePaymentLinkRequestModel>;
//----------------------End----------------------//

export const SubscriptionSuccessRequestModel = z.object({
    subscriptionPaymentId: z.string(),
    userId: z.string(),
    status: z.string(),
    code: z.string(),
    id: z.string(),
    cancel: z.boolean(),
    orderCode: z.string(),
});

export type ISubscriptionSuccessRequestModel = z.infer<typeof SubscriptionSuccessRequestModel>;
//----------------------End----------------------//

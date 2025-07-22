import { z } from "zod";

/**
 * Model of Subscription
 */
export const SubscriptionPlanModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    priceForMonth: z.number(),
    priceForYear: z.number().optional(),
    isActive: z.boolean(),
    planType: z.string(),
    billingCycle: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional()
});

export type ISubscriptionPlanModel = z.infer<typeof SubscriptionPlanModel>;


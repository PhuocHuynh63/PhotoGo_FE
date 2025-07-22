import { SubscriptionPlanModel } from "@models/subcription_plan/common.model";
import { z } from "zod";

/**
 * Model of Subscription
 */
export const SubscriptionModel = z.object({
    id: z.string(),
    userId: z.string(),
    planId: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    billingCycle: z.string(),
    lastBilledAt: z.string(),
    nextBillingAt: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    plan: SubscriptionPlanModel.optional()
});

export type ISubscriptionModel = z.infer<typeof SubscriptionModel>;


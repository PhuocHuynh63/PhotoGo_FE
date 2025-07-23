import { z } from "zod";
import { SubscriptionPlanModel } from "./common.model";
/**
 * Model of SubscriptionPlanResponse
 */
export const SubscriptionPlanResponseModel = z.object({
        statusCode: z.number(),
        message: z.string(),
        data: z.array(SubscriptionPlanModel),
});

export type ISubscriptionPlanResponseModel = z.infer<typeof SubscriptionPlanResponseModel>;
//----------------------End----------------------//
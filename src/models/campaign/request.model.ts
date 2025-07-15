import { z } from "zod";

/** 
 * Model of CampaignRequest
 */
export const CampaignRequestModel = z.object({
    name: z.string(),
    description: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.boolean(),
});

export type ICampaignRequestModel = z.infer<typeof CampaignRequestModel>;


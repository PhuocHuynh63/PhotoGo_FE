import { z } from "zod";

/**
 * Model of Campaign
 */
export const CampaignModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.string(),
    progress: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    totalVoucher: z.number(),
    usedVoucher: z.number(),
    remainingVoucher: z.number(),
});

export type ICampaign = z.TypeOf<typeof CampaignModel>

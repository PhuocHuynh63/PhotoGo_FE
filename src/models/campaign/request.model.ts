import { z } from "zod";

/** 
 * Model of create Campaign
 */
export const CreateCampaignModel = z.object({
    name: z.string(),
    description: z.string(),
    startDate: z.string(),
    endDate: z.string(),
});

export type ICreateCampaignModel = z.infer<typeof CreateCampaignModel>;


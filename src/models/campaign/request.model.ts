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
//----------------------------End-----------------------------//

/*
* Model of Invite vendor to campaign
*/
export const InviteVendorToCampaignModel = z.object({
    campaignId: z.string(),
    vendorId: z.string(),
});

export type IInviteVendorToCampaignModel = z.infer<typeof InviteVendorToCampaignModel>;
//----------------------------End-----------------------------//

/*
* Model of accept invite to campaign
*/

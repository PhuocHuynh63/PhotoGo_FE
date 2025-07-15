import { z } from "zod";
import { CampaignModel } from "./common.model";
import { PaginationModel } from "@models/metadata";

/**
 * Model of CampaignData
 */
export const CampaignDataModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
      data: z.array(CampaignModel),
      pagination: PaginationModel,
    }),
});

export type ICampaignResponseModel = z.infer<typeof CampaignDataModel>;



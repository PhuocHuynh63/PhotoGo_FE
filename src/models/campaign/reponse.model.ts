import { z } from "zod";
import { CampaignModel } from "./common.model";
import { PaginationModel } from "@models/metadata";
import { VendorOfCampaignModel as VendorOfCampaignModelVendor } from "@models/vendor/common.model";
import { VoucherModel } from "@models/voucher/common.model";

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

export const CampaignDetailModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
      data: CampaignModel,
    }),
});

export type ICampaignDetailModel = z.infer<typeof CampaignDetailModel>;


export const VendorOfCampaignModel = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    data: z.array(VendorOfCampaignModelVendor),
    pagination: PaginationModel,
  }),
});

export type IVendorOfCampaignModel = z.infer<typeof VendorOfCampaignModel>;

export const VoucherOfCampaignModel = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    data: z.array(VoucherModel),
    pagination: PaginationModel,
  }),
});

export type IVoucherOfCampaignModel = z.infer<typeof VoucherOfCampaignModel>;
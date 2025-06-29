import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { VoucherFromCampaignModel, VoucherFromPointModel, VoucherModel } from "./common.model";
import { PaginationModel } from "@models/metadata";

/**
 * Model of VoucherResponse
 */
export const VoucherDataModel = z.object({
    voucher: VoucherModel,
    assigned_at: z.string(),
    is_valid: z.boolean(),
    status: z.string(),
    used_at: z.string(),
    user_id: z.string(),
    voucher_id: z.string()
});

export const VoucherModelResponse = z.object({
    data: z.array(VoucherDataModel),
    message: z.string(),
    pagination: PaginationModel
});

export const VoucherResponseModel = BackendResponseModel(VoucherModelResponse);
export type IVoucherResponseModel = z.infer<typeof VoucherResponseModel>;

/**
 * Model of Single Voucher Response
 */
export const SingleVoucherModelResponse = z.object({
    data: VoucherDataModel,
    message: z.string(),
    statusCode: z.number()
});

export const SingleVoucherResponseModel = BackendResponseModel(SingleVoucherModelResponse);
export type ISingleVoucherResponseModel = z.infer<typeof SingleVoucherResponseModel>;

/**
 * Model of Edit Voucher Response
 */
export const EditVoucherModelResponse = z.object({
    data: VoucherDataModel,
    message: z.string(),
    statusCode: z.number()
});

export const EditVoucherResponseModel = BackendResponseModel(EditVoucherModelResponse);
export type IEditVoucherResponseModel = z.infer<typeof EditVoucherResponseModel>;

/**
 * Model of Delete Voucher Response
 */
export const DeleteVoucherModelResponse = z.object({
    message: z.string(),
    statusCode: z.number()
});

export const DeleteVoucherResponseModel = BackendResponseModel(DeleteVoucherModelResponse);
export type IDeleteVoucherResponseModel = z.infer<typeof DeleteVoucherResponseModel>;

export const VoucherFromPointModelResponse = z.object({
    data: z.array(VoucherFromPointModel),
    message: z.string(),
    statusCode: z.number(),
    pagination: PaginationModel.optional()
});

export const VoucherFromPointResponseModel = BackendResponseModel(VoucherFromPointModelResponse);
export type IVoucherFromPointResponseModel = z.infer<typeof VoucherFromPointResponseModel>;

export const VoucherFromCampaignModelResponse = z.object({
    data: z.array(VoucherFromCampaignModel),
    message: z.string(),
    statusCode: z.number(),
    pagination: PaginationModel.optional()
});

export const VoucherFromCampaignResponseModel = BackendResponseModel(VoucherFromCampaignModelResponse);
export type IVoucherFromCampaignResponseModel = z.infer<typeof VoucherFromCampaignResponseModel>;





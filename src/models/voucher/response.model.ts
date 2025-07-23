import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { ExchangeVoucherModel, VoucherFilterModel, VoucherModel } from "./common.model";
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
//---------------------End------------------//

/**
 * Model of Voucher Filter Response
 */
export const VoucherFilterModelResponse = z.object({
    data: z.array(VoucherFilterModel),
    message: z.string(),
    statusCode: z.number(),
    pagination: PaginationModel.optional()
});

export const VoucherFilterModelResponseModel = BackendResponseModel(VoucherFilterModelResponse);
export type IVoucherFilterResponseModel = z.infer<typeof VoucherFilterModelResponseModel>;
//---------------------End------------------//

/**
 * Model of Voucher List Response
 */
export const VoucherListModelResponse = z.object({
    data: z.array(VoucherModel),
    message: z.string(),
    statusCode: z.number(),
    pagination: PaginationModel
});
export const VoucherListResponseModel = BackendResponseModel(VoucherListModelResponse);
export type IVoucherListResponseModel = z.infer<typeof VoucherListResponseModel>;

export const ExchangeVoucherModelResponse = z.object({
    data: ExchangeVoucherModel,
    message: z.string(),
    statusCode: z.number()
});

export const ExchangeVoucherResponseModel = BackendResponseModel(ExchangeVoucherModelResponse);
export type IExchangeVoucherResponseModel = z.infer<typeof ExchangeVoucherResponseModel>;
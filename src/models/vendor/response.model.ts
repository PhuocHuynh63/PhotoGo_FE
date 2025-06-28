import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { VendorModel, VendorListItemModel } from "./common.model";
import { z } from "zod";
import { PaginationModel } from "@models/metadata";

/**
 * Model of VendorsData
 */
export const VendorsDataModel = z.object({
    data: z.array(VendorModel),
    message: z.string(),
    pagination: PaginationModel
});

export const VendorsResponseModel = BackendResponseModel(VendorsDataModel);
export type IVendorsData = z.infer<typeof VendorsDataModel>;
//----------------------End----------------------//

/**
 * Model of VendorResponse
 */
export const VendorResponseModel = BackendResponseModel(VendorModel);
export type IVendorResponse = z.infer<typeof VendorResponseModel>;
//----------------------End----------------------//

/**
 * Model of VendorByIdResponse
 */
export const VendorByIdModel = VendorModel

export const VendorByIdResponseModel = BackendResponseModel(VendorByIdModel);
export type IVendorByIdResponse = z.infer<typeof VendorByIdResponseModel>;
//----------------------End----------------------//

/**
 * Model cho data bên trong "data" của API filter admin
 */
export const AdminFilterVendorsDataModel = z.object({
    message: z.string(),
    data: z.array(VendorListItemModel),
    pagination: PaginationModel
});

/**
 * Model response tổng thể cho API filter admin
 */
export const AdminFilterVendorsResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: AdminFilterVendorsDataModel
});

export type IAdminFilterVendorsData = z.infer<typeof AdminFilterVendorsDataModel>;
export type IAdminFilterVendorsResponse = z.infer<typeof AdminFilterVendorsResponseModel>;
//----------------------End----------------------//
import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { VendorModel } from "./common.model";
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
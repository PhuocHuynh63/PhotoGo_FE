import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { VendorModel } from "./common.model";
import { z } from "zod";

/**
 * Model of VendorsData
 */
export const VendorsDataModel = z.object({
    data: z.array(VendorModel),
    message: z.string(),
    pagination: z.object({
        totalItem: z.number(),
        current: z.number(),
        totalPage: z.number(),
        pageSize: z.number()
    })
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
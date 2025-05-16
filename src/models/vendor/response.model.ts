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

export type IVendorsData = z.infer<typeof VendorsDataModel>;
//----------------------End----------------------//

/**
 * Model of VendorsResponse
 */
export const VendorsResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: VendorsDataModel
});

export type IVendorsResponse = z.infer<typeof VendorsResponseModel>;
//----------------------End----------------------//
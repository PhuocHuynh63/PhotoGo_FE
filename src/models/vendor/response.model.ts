import { VendorModel } from "./common.model";
import { z } from "zod";

export const VendorsDataModel = z.object({
    data: z.array(VendorModel),
    message: z.string(),
    pagination: z.object({
        totalItem: z.number()
    })
});

export const VendorsResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: VendorsDataModel
});

export type IVendorsData = z.infer<typeof VendorsDataModel>;
export type IVendorsResponse = z.infer<typeof VendorsResponseModel>;
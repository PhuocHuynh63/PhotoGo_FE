import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { ServiceTypeModel } from "./common.model";

/**
 * Model of ServiceTypesData
 */
export const ServiceTypesDataModel = z.object({
    data: z.array(ServiceTypeModel),
    message: z.string(),
    pagination: z.object({
        totalItem: z.number(),
        current: z.number(),
        totalPage: z.number(),
        pageSize: z.number()
    })
});

export const ServiceTypesResponseModel = BackendResponseModel(ServiceTypesDataModel);
export type IServiceTypesResponse = z.infer<typeof ServiceTypesResponseModel>;
//----------------------End----------------------//

/**
 * Model of ServiceTypeResponse
 */
export const ServiceTypeResponseModel = BackendResponseModel(ServiceTypeModel);
export type IServiceTypeResponse = z.infer<typeof ServiceTypeResponseModel>;
//----------------------End----------------------//
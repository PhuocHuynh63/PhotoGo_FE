import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { ServiceTypeModel, ServiceTypeFilterModel } from "./common.model";
import { PaginationModel } from "@models/metadata";

/**
 * Model of ServiceTypesData
 */
export const ServiceTypesDataModel = z.object({
    data: z.array(ServiceTypeModel),
    message: z.string(),
    pagination: PaginationModel
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

export const ServiceTypeFilterResponseModel = z.object({
    status: z.string(),
    message : z.string(),
    data : z.object({
        data: z.array(ServiceTypeFilterModel),
        pagination: PaginationModel
    })
});
export type IServiceTypeFilterResponse = z.infer<typeof ServiceTypeFilterResponseModel>;
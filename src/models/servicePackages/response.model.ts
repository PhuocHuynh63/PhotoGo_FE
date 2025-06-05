import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { ServicePackageModel } from "./common.model";
import { z } from "zod";

/**
 * Model of VendorsData
 */
export const ServicePackagesDataModel = z.object({
    data: z.array(ServicePackageModel),
    pagination: z.object({
        totalItem: z.number(),
        current: z.number(),
        totalPage: z.number(),
        pageSize: z.number()
    })
});

export const ServicePackagesResponseModel = BackendResponseModel(ServicePackagesDataModel);
export type IServicePackagesData = z.infer<typeof ServicePackagesDataModel>;
//----------------------End----------------------//

/**
 * Model of VendorResponse
 */
export const ServicePackageResponseModel = BackendResponseModel(ServicePackageModel);
export type IServicePackageResponse = z.infer<typeof ServicePackageResponseModel>;

export const ServicePackagesListResponseModel = BackendResponseModel(ServicePackagesDataModel);
export type IServicePackagesListResponse = z.infer<typeof ServicePackagesListResponseModel>;
//----------------------End----------------------//
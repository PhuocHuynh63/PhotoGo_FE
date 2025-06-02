import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { ServiceConceptImageModel } from "./common.model";

/**
 * Model of ServiceConceptImageModel
 */
export const ServiceConceptImageModelResponse = z.object({
    data: z.array(ServiceConceptImageModel),
    message: z.string(),
    pagination: z.object({
        current: z.number(),
        pageSize: z.number(),
        totalItem: z.number(),
        totalPage: z.number(),
    })
});

export const ServiceConceptImageResponseModel = BackendResponseModel(ServiceConceptImageModelResponse);
export type IServiceConceptImageModel = z.infer<typeof ServiceConceptImageResponseModel>;
//----------------------End----------------------//
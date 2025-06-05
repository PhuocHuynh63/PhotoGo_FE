import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { ServiceConceptImageModel } from "./common.model";
import { PaginationModel } from "@models/metadata";

/**
 * Model of ServiceConceptImageModel
 */
export const ServiceConceptImageModelResponse = z.object({
    data: z.array(ServiceConceptImageModel),
    message: z.string(),
    pagination: PaginationModel
});

export const ServiceConceptImageResponseModel = BackendResponseModel(ServiceConceptImageModelResponse);
export type IServiceConceptImageResponseModel = z.infer<typeof ServiceConceptImageResponseModel>;
//----------------------End----------------------//
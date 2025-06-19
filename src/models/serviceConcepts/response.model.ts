import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { InvoiceServiceModel, ServiceConceptImageModel } from "./common.model";
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

/**
 * Model of ServiceConceptModel
 */
export const ServiceConceptModelResponse = z.object({
    data: InvoiceServiceModel,
});

export const ServiceConceptResponseModel = BackendResponseModel(ServiceConceptModelResponse);
export type IServiceConceptResponseModel = z.infer<typeof ServiceConceptResponseModel>;
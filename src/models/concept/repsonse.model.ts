import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { ServiceTypeModel } from "@models/serviceTypes/common.model";
import { z } from "zod";
import { ConceptModel } from "./common.model";

/**
 * Model of ServiceConcept
 */
export const ServiceConceptByIdResponseModel = z.object({
    data: ConceptModel,
    serviceConceptServiceTypes: z.array(
        z.object({
            serviceConceptId: z.string().uuid(),
            serviceTypeId: z.string().uuid(),
            createdAt: z.string(),
            serviceType: ServiceTypeModel,
        })
    ),
    // images: 
});

export const ServiceConceptByIdResponse = BackendResponseModel(ServiceTypeModel);
export type IServiceConceptResponse = z.infer<typeof ServiceConceptByIdResponseModel>;
//----------------------End----------------------//
import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { ServiceTypeModel } from "@models/serviceTypes/common.model";
import { z } from "zod";

/**
 * Model of ServiceConcept
 */
export const ServiceConceptByIdResponseModel = z.object({
    data: ServiceTypeModel,
    serviceConceptServiceTypes: z.array(
        z.object({
            serviceConceptId: z.string().uuid(),
            serviceTypeId: z.string().uuid(),
            createdAt: z.string(),
            serviceType: ServiceTypeModel,
        })
    ),
});

export const ServiceConceptByIdResponse = BackendResponseModel(ServiceTypeModel);
export type IServiceConceptResponse = z.infer<typeof ServiceConceptByIdResponseModel>;
//----------------------End----------------------//
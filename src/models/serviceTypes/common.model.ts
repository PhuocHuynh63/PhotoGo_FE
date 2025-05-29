import { ServiceConceptServiceTypeModel } from "@models/serviceConceptServiceType/common.model";
import { z } from "zod";

/**
 * Model of ServiceType
 */

export const ServiceTypeModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    serviceConceptServiceTypes: z.array(ServiceConceptServiceTypeModel),
});

export type IServiceType = z.infer<typeof ServiceTypeModel>;
//----------------------End----------------------//
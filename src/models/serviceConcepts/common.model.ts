
import { ServiceTypeModel } from "@models/serviceTypes/common.model";
import { z } from "zod";

/**
 * Model of ServiceConcept
 */
export const ServiceConceptModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.array(z.string()),
    price: z.string(),
    duration: z.number(),
    serviceTypes: z.array(ServiceTypeModel),
});

export type IServiceConcept = z.infer<typeof ServiceConceptModel>;
//----------------------End----------------------//
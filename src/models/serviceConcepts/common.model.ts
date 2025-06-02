import { ServiceTypeModel } from "@models/serviceTypes/common.model";
import { z } from "zod";

/**
 * Model of ServiceConcept
 */
export const ServiceConceptModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    price: z.string(),
    duration: z.number(),
    serviceTypes: z.array(ServiceTypeModel),
});

export type IServiceConcept = z.infer<typeof ServiceConceptModel>;
//----------------------End----------------------//


/**
 * Model of ServiceConceptImage
 */
export const ServiceConceptImageModel = z.object({
    id: z.string(),
    image_url: z.string(),
    service_concept_id: z.string(),
    created_at: z.string(),
});
export type IServiceConceptImageModel = z.infer<typeof ServiceConceptImageModel>;
//----------------------End----------------------//
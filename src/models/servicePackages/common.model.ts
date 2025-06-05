import { ServiceConceptModel } from "@models/serviceConcepts/common.model";
import { z } from "zod";

/**
 * Model of ServicePackage
 */
export const ServicePackageModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string(),
    status: z.string(),
    // vendorId: z.string(),
    serviceConcepts: z.array(ServiceConceptModel),
    minPrice: z.number(),
    maxPrice: z.number(),
    // duration: z.number(),
    created_at: z.string(),
    updated_at: z.string()
});

export type IServicePackage = z.infer<typeof ServicePackageModel>;
//----------------------End----------------------//
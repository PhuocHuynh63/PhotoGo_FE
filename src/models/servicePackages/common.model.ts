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
    vendorId: z.string(),
    serviceConcepts: z.array(ServiceConceptModel),
    minPrice: z.number(),
    maxPrice: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    countPackageUsed: z.number().optional(),
    vendor: z.object({
        slug: z.string(),
        locations: z.array(z.object({
            district: z.string(),
            city: z.string()
        }))
    })

});

export type IServicePackage = z.infer<typeof ServicePackageModel>;
//----------------------End----------------------//
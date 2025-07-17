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
});

export type IServiceTypeModel = z.infer<typeof ServiceTypeModel>;
//----------------------End----------------------//

/**
 * Model of ServiceTypeFilter
 */
export const ServiceTypeFilterModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    serviceConceptServiceTypes: z.array(z.object({
        serviceConceptId: z.string(),
        serviceTypeId: z.string(),
        createdAt: z.string(),
    })),
    conceptCount: z.number(),
    packageCount: z.number(),
});

export type IServiceTypeFilterModel = z.infer<typeof ServiceTypeFilterModel>;
//----------------------End----------------------//
        

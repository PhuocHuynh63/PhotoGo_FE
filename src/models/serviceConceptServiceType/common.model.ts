import { z } from "zod";

/**
 * Model of ServiceConceptServiceType
 */
export const ServiceConceptServiceTypeModel = z.object({
    serviceConceptId: z.string(),
    serviceTypeId: z.string(),
    createdAt: z.string(),
});

export type IServiceConceptServiceType = z.infer<typeof ServiceConceptServiceTypeModel>;
//----------------------End----------------------//
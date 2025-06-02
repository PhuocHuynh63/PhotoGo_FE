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
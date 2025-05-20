import { z } from "zod";

/**
 * Model of ServiceType
 */
export const ServiceTypeModel = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
});

export type IServiceType = z.infer<typeof ServiceTypeModel>;
//----------------------End----------------------//
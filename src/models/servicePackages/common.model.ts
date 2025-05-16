import { z } from "zod";

/**
 * Model of ServicePackage
 */
export const ServicePackageModel = z.object({
    id: z.string(),
    vendorId: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.string(),
    duration: z.number(),
    status: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

export type IServicePackage = z.infer<typeof ServicePackageModel>;
//----------------------End----------------------//
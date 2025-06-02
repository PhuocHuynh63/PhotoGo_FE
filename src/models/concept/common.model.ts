import { z } from "zod";

/**
 * Model of Concept
 */

export const ConceptModel = z.object({
    id: z.string().uuid(),
    servicePackgeId: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    duration: z.number(),
    status: z.enum(["hoạt động", "không hoạt động"]),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type IConceptModel = z.infer<typeof ConceptModel>;
//----------------------End----------------------//
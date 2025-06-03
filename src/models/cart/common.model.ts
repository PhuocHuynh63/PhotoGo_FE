import { z } from "zod";

/**
 * Model of Cart Item
 */
export const ServiceConceptModel = z.object({
    id: z.string(),
    servicePackageId: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.string(),
    duration: z.number(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const CartItemModel = z.object({
    id: z.string(),
    cartId: z.string(),
    serviceConceptId: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    serviceConcept: ServiceConceptModel
});

export type ICartItem = z.TypeOf<typeof CartItemModel>;
export type IServiceConcept = z.TypeOf<typeof ServiceConceptModel>;
//----------------------End----------------------//

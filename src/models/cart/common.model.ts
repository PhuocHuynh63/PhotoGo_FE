import { ServiceConceptModel } from "@models/serviceConcepts/common.model";
import { z } from "zod";

/**
 * Model of Cart Item
 */

export const CartItemModel = z.object({
    id: z.string(),
    cartId: z.string(),
    serviceConceptId: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    serviceConcept: ServiceConceptModel
});

export type ICartItem = z.TypeOf<typeof CartItemModel>;
//----------------------End----------------------//

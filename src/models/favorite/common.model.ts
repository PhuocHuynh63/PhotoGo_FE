import { ServiceConceptModel } from "@models/serviceConcepts/common.model";
import { z } from "zod";

/**
 * Model of Favorite Detail (with service concept)
 */
export const FavoriteDetailModel = z.object({
    id: z.string().uuid(),
    created_at: z.string(),
    updated_at: z.string(),
    wishlistId: z.string().uuid(),
    serviceConceptId: z.string().uuid(),
    serviceConcept: ServiceConceptModel,
});
export type IFavoriteDetailModel = z.infer<typeof FavoriteDetailModel>;
//----------------------End----------------------//


/**
 * Model of Favorite
 */
export const FavoriteModel = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    items: z.array(FavoriteDetailModel),
    created_at: z.string(),
    updated_at: z.string(),
});

export const FavoriteListModel = z.array(FavoriteModel);
export type IFavoriteModel = z.infer<typeof FavoriteModel>;
//----------------------End----------------------//


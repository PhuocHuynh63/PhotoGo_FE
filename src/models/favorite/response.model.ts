import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { FavoriteModel } from "./common.model";
import { PaginationModel } from "@models/metadata";

/**
 * Model of FavoriteListResponseModel
 */
export const FavoriteListResponseModel = z.object({
    data: z.array(z.object({
        items: z.array(FavoriteModel)
    })),
    pagination: PaginationModel
})

export const FavoriteListResponse = BackendResponseModel(FavoriteListResponseModel);
export type IFavoriteListResponse = z.infer<typeof FavoriteListResponse>;
//----------------------End----------------------//

/**
 * Model of FavoriteResponseModel
 */
export const AddFavoriteResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        wishlistId: z.string(),
        serviceConceptId: z.string(),
        wishlist: z.object({
            id: z.string(),
            created_at: z.string(),
            updated_at: z.string()
        })
    })
})

export const AddFavoriteResponse = BackendResponseModel(AddFavoriteResponseModel);
export type IAddFavoriteResponse = z.infer<typeof AddFavoriteResponse>;
//----------------------End----------------------//
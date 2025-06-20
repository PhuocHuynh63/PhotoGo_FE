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
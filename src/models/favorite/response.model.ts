import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { FavoriteModel } from "./common.model";

/**
 * Model of FavoriteListResponseModel
 */
export const FavoriteListResponseModel = FavoriteModel

export const FavoriteListResponse = BackendResponseModel(FavoriteListResponseModel);
export type IFavoriteListResponse = z.infer<typeof FavoriteListResponse>;
//----------------------End----------------------//
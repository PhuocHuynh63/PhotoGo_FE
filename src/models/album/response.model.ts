import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { AlbumModel } from "./common.model";

/**
 * Model of Album
 */

export const AlbumResponseModel = BackendResponseModel(AlbumModel);
export type IAlbumResponseModel = z.infer<typeof AlbumResponseModel>;
//----------------------End----------------------//

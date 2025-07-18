import { z } from "zod";
import { VendorAlbumsModel } from "./common.model";
import { BackendResponseModel } from "@models/backend/backendResponse.model";

export const VendorAlbumsByBookingIdResponse = VendorAlbumsModel

export const VendorAlbumsByBookingId = BackendResponseModel(VendorAlbumsByBookingIdResponse);
export type IVendorAlbumsByBookingIdResponse = z.infer<typeof VendorAlbumsByBookingId>;
import { z } from "zod";
import { VendorAlbumsModel } from "./common.model";
import { PaginationModel } from "@models/metadata";
import { BackendResponseModel } from "@models/backend/backendResponse.model";

export const VendorAlbumsByBookingIdResponse = z.object({
    data: z.array(VendorAlbumsModel),
    pagination: PaginationModel
});

export const VendorAlbumsByBookingId = BackendResponseModel(VendorAlbumsByBookingIdResponse);
export type IVendorAlbumsByBookingIdResponse = z.infer<typeof VendorAlbumsByBookingId>;
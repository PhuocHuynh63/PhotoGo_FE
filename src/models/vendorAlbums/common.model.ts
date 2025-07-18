import { z } from "zod";

/**
 * VendorAlbumsModel defines the structure of a vendor album object.
 */
export const VendorAlbumsModel = z.object({
    id: z.string(),
    bookingId: z.string(),
    photos: z.array(z.string()),
    behindTheScenes: z.array(z.string()),
    driveLink: z.string(),
    vendorAlbum: z.any(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export type VendorAlbumsModel = z.infer<typeof VendorAlbumsModel>;

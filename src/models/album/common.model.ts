import { BookingModel } from "@models/booking/common.model";
import { z } from "zod";

export const VendorAlbumModel = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AlbumModel = z.object({
  id: z.string(),
  bookingId: z.string(),
  photos: z.array(z.any()), // Thay z.any() bằng schema cụ thể nếu có
  behindTheScenes: z.array(z.any()), // Thay z.any() bằng schema cụ thể nếu có
  driveLink: z.string().nullable(),
  date: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  vendorAlbum: VendorAlbumModel,
  booking: BookingModel,
});

export type IAlbum = z.infer<typeof AlbumModel>;
//----------------------End----------------------//
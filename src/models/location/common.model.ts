import { z } from "zod";

/**
 * Model of User
 */
export const LocationModel = z.object({
    id: z.string(),
    address: z.string(),
    district: z.string(),
    ward: z.string(),
    city: z.string(),
    province: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});
export type ILocation = z.TypeOf<typeof LocationModel>
//----------------------End----------------------//

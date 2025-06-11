import { z } from "zod";

/**
 * Model of LocationAvailability Request
 */
export const LocationAvailabilityRequestModel = z.object({
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    isAvailable: z.boolean(),
});

export type ILocationAvailabilityRequest = z.TypeOf<typeof LocationAvailabilityRequestModel>;

//----------------------End----------------------//

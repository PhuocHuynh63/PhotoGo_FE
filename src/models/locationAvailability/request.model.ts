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

/**
 * Model of Update Slot Time Request
 */
export const UpdateSlotTimeRequestModel = z.object({
    maxParallelBookings: z.number(),
});

export type IUpdateSlotTimeRequest = z.TypeOf<typeof UpdateSlotTimeRequestModel>;

import { z } from "zod";

/**
 * Model of LocationAvailability Request
 */
export const LocationAvailabilityRequestModel = z.object({
    startDate: z.string(),
    endDate: z.string(),
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


/**
 * Model of Update Availability Request
 */
export const UpdateAvailabilityRequestModel = z.object({
    isAvailable: z.boolean(),
});

export type IUpdateAvailabilityRequest = z.TypeOf<typeof UpdateAvailabilityRequestModel>;

//----------------------End----------------------//
import { z } from "zod";

/**
 * Model of SlotTime
 */
export const SlotTimeModel = z.object({
    id: z.string(),
    slot: z.number(),
    startSlotTime: z.string(),
    endSlotTime: z.string(),
    isStrictTimeBlocking: z.boolean(),
    maxParallelBookings: z.number(),
});
export type ISlotTime = z.TypeOf<typeof SlotTimeModel>

/**
 * Model of Location (used in schedule response)
 */
export const LocationModel = z.object({
    id: z.string(),
    address: z.string(),
    district: z.string(),
    ward: z.string(),
    city: z.string(),
    province: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});
export type ILocation = z.TypeOf<typeof LocationModel>

/**
 * Model of LocationSchedule (based on the response data)
 */
export const LocationScheduleModel = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    isAvailable: z.boolean(),
    location: LocationModel,
    slotTimes: z.array(SlotTimeModel),
    workingDates: z.array(z.string()),
});
export type ILocationSchedule = z.TypeOf<typeof LocationScheduleModel>

//----------------------End----------------------//

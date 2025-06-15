import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { LocationScheduleModel } from "./common.model";

/**
 * Model of LocationSchedule Response
 */
export const LocationScheduleResponseModel = z.object({
    data: z.array(LocationScheduleModel),
});

export const LocationScheduleResponse = BackendResponseModel(LocationScheduleResponseModel);
export type ILocationScheduleResponse = z.infer<typeof LocationScheduleResponse>;

//----------------------End----------------------// 

/**
 * Model of Update Availability Response
 */
export const UpdateAvailabilityResponseModel = z.object({
    data: z.object({
        id: z.string(),
        date: z.string(),
        isAvailable: z.boolean()
    }),
    message: z.string(),
    statusCode: z.number()
});

export const UpdateAvailabilityResponse = BackendResponseModel(UpdateAvailabilityResponseModel);
export type IUpdateAvailabilityResponse = z.infer<typeof UpdateAvailabilityResponse>;

//----------------------End----------------------// 
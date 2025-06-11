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
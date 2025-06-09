import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { AttendanceModel, CheckAttendanceModel } from "./common.model";

/**
 * Model of Attendance
 */
export const AttendanceDataModel = z.object({
    data: z.array(AttendanceModel),
    message: z.string(),
    statusCode: z.number(),
});

export const AttendanceResponseModel = BackendResponseModel(AttendanceDataModel);
export type IAttendanceResponseModel = z.infer<typeof AttendanceResponseModel>;
//----------------------End----------------------//

/**
 * Model of Check Attendance
 */
export const CheckAttendanceDataModel = z.object({
    data: CheckAttendanceModel,
    message: z.string(),
    statusCode: z.number(),
});
export const CheckAttendanceResponseModel = BackendResponseModel(CheckAttendanceDataModel);
export type ICheckAttendanceResponseModel = z.infer<typeof CheckAttendanceResponseModel>;
//----------------------End----------------------//
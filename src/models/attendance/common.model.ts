import { z } from "zod";

/**
 * Model of Attendance
 */
export const AttendanceModel = z.object({
    id: z.string(),
    date: z.string(),
    isChecked: z.boolean(),
    pointsEarned: z.number(),
    streak: z.number(),
    userId: z.string(),
});
export type IAttendance = z.TypeOf<typeof AttendanceModel>
//----------------------End----------------------//

/**
 * Model of Check Attendance
 */
export const CheckAttendanceModel = z.object({
    hasAttended: z.boolean(),
});
export type ICheckAttendance = z.TypeOf<typeof CheckAttendanceModel>
//----------------------End----------------------//
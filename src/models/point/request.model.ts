import { z } from "zod";

/**
 * Model cho request point history
 */
export const PointHistoryRequestModel = z.object({
    userId: z.string(),
    current: z.string().optional(),
    pageSize: z.string().optional(),
    type: z.string().optional(),
    sortDirection: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minAmount: z.string().optional(),
    maxAmount: z.string().optional(),
    direction: z.string().optional(),
});
  
export type IPointHistoryRequest = z.infer<typeof PointHistoryRequestModel>;

/**
Model adjust point
 */
export const AdjustPointRequestModel = z.object({
    userId: z.string(),
    amount: z.number(),
    type: z.string(),
    description: z.string(),
});

export type IAdjustPointRequest = z.infer<typeof AdjustPointRequestModel>;





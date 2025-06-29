import { UserModel } from "@models/user/common.model";
import { z } from "zod";

/**
 * Model of Point
 */
export const PointModel = z.object({
    id: z.string(),
    balance: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    user: UserModel,
});

export type IPoint = z.TypeOf<typeof PointModel>;

/**
 * Model of Point Transaction
 */
export const PointTransactionModel = z.object({
    id: z.string(),
    amount: z.number(),
    created_at: z.string(),
    description: z.string(),
    type: z.string(),
});
export type IPointTransaction = z.TypeOf<typeof PointTransactionModel>;
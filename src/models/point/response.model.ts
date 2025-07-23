import { z } from "zod";
import { PointModel, PointTransactionModel } from "./common.model";
import { PaginationModel } from "@models/metadata";

/**
 * Model of Point Response
 */
export const PointResponseModel = z.object({
    data: PointModel,
    message: z.string(),
    status: z.string(),
});
export type IPointResponse = z.TypeOf<typeof PointResponseModel>;

/**
 * Model of Point Transaction Response
 */
export const PointTransactionResponseModel = z.object({
    data: z.object({
        data: z.array(PointTransactionModel),
        pagination: PaginationModel,
    }),
    message: z.string(),
    status: z.string(),
});
export type IPointTransactionResponse = z.TypeOf<typeof PointTransactionResponseModel>;

/**
 * Model of Point Admin Response
 */
export const PointAdminResponseModel = z.object({
    data: z.object({
        data: z.array(PointModel),
        pagination: PaginationModel,
    }),
    message: z.string(),
    status: z.string(),
});
export type IPointAdminResponse = z.TypeOf<typeof PointAdminResponseModel>;




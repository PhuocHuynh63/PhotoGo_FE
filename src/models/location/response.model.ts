import { z } from "zod";
import { PaginationModel } from "@models/metadata";
import { LocationModel } from "./common.model";

/**
 * Model of All Location
 */
export const AllLocationResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        data: z.array(z.string()),
        pagination: PaginationModel
    })
});

export type IAllLocationResponse = z.infer<typeof AllLocationResponseModel>;
//----------------------End----------------------//


/**
 * Model of Location
 */
export const LocationResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: LocationModel
});

export type ILocationResponse = z.infer<typeof LocationResponseModel>;
//----------------------End----------------------//
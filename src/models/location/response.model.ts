import { z } from "zod";
import { PaginationModel } from "@models/metadata";

export const AllLocationResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.object({
        data: z.array(z.string()),
        pagination: PaginationModel
    })
});

export type IAllLocationResponse = z.infer<typeof AllLocationResponseModel>;
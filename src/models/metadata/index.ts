import { z } from "zod";

/**
 * PaginationModel is a schema for User response
 */
export const PaginationModel = z.object({
    totalItem: z.number(),
    current: z.number(),
    totalPage: z.number(),
    pageSize: z.number()
})
export type IPagination = z.infer<typeof PaginationModel>
//----------------------End----------------------//
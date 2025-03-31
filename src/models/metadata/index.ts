import { z } from "zod";

/**
 * UserSchema is a schema for User response
 */
export const PaginationModel = z.object({
    current: z.number(),
    pageSize: z.number(),
    totalPage: z.number(),
    totalItem: z.number(),
})
export type IPagination = z.infer<typeof PaginationModel>
//----------------------End----------------------//
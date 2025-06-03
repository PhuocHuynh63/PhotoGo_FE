import { z } from "zod";
import { CartItemModel } from "./common.model";


export const CartResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: z.array(CartItemModel)
});

export type ICartResponse = z.infer<typeof CartResponseModel>;
import { z } from "zod";
import { CategoryModel } from "./common.model";

export const CategoriesDataModel = z.object({
    data: z.array(CategoryModel),
    message: z.string(),
    pagination: z.object({
        totalItem: z.number(),
        current: z.number(),
        totalPage: z.number(),
        pageSize: z.number()
    })
});

export const CategoriesResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: CategoriesDataModel
});

export type ICategoriesData = z.infer<typeof CategoriesDataModel>;
export type ICategoriesResponse = z.infer<typeof CategoriesResponseModel>;
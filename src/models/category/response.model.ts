import { z } from "zod";
import { CategoryModel } from "./common.model";
import { PaginationModel } from "@models/metadata";


export const CategoriesDataModel = z.object({
    data: z.array(CategoryModel),
    message: z.string(),
    pagination: PaginationModel
});

export const CategoriesResponseModel = z.object({
    statusCode: z.number(),
    message: z.string(),
    data: CategoriesDataModel
});

export type ICategoriesData = z.infer<typeof CategoriesDataModel>;
export type ICategoriesResponse = z.infer<typeof CategoriesResponseModel>;


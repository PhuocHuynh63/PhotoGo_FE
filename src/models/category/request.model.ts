import { z } from "zod";

/**
 * Request models for Category
 */

// Create category request
export const CreateCategoryRequestModel = z.object({
    name: z.string().min(1, "Tên danh mục không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống"),
    isPublic: z.boolean().optional().default(true),
});

// Update category request
export const UpdateCategoryRequestModel = z.object({
    name: z.string().min(1, "Tên danh mục không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống"),
    isPublic: z.boolean().optional(),
});

// Get categories request (for future pagination, search, filter)
export const GetCategoriesRequestModel = z.object({
    search: z.string().optional(),
    status: z.enum(['public', 'private', 'all']).optional().default('all'),
    page: z.number().min(1).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(10),
    sortBy: z.enum(['name', 'description', 'createdAt']).optional().default('name'),
    sortDirection: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type ICreateCategoryRequest = z.infer<typeof CreateCategoryRequestModel>;
export type IUpdateCategoryRequest = z.infer<typeof UpdateCategoryRequestModel>;
export type IGetCategoriesRequest = z.infer<typeof GetCategoriesRequestModel>;

//----------------------End----------------------// 
import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { ReviewAllModel, ReviewVendorDetailModel } from "./common.model";
import { PaginationModel } from "@models/metadata";

/**
 * Model of Review Pagination Response
 */
const ReviewPaginationResponse = z.object({
    data: z.array(ReviewVendorDetailModel),
    pagination: PaginationModel,
    averageRating: z.number().optional(),
});

const ReviewPagination = BackendResponseModel(ReviewPaginationResponse);
export type IReviewPaginationResponse = z.infer<typeof ReviewPagination>;
export type IReviewPaginationResponseModel = z.infer<typeof ReviewPaginationResponse>;
//----------------------End----------------------//


const ReviewAllResponse = z.object({
    data: z.array(ReviewAllModel),
    pagination: PaginationModel,
});

const ReviewAll = BackendResponseModel(ReviewAllResponse);
export type IReviewAllResponse = z.infer<typeof ReviewAll>;
//----------------------End----------------------//

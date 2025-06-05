import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { ReviewVendorDetailModel } from "./common.model";
import { PaginationModel } from "@models/metadata";

/**
 * Model of Review Pagination Response
 */
const ReviewPaginationResponse = z.object({
    data: z.array(ReviewVendorDetailModel),
    pagination: PaginationModel
});

const ReviewPagination = BackendResponseModel(ReviewPaginationResponse);
export type IReviewPaginationResponse = z.infer<typeof ReviewPagination>;
//----------------------End----------------------//


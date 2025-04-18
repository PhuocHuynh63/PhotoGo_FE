
import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { PaginationModel } from "@models/metadata";
import { z } from 'zod';
import { VendorModel } from "./common.model";


export const StudiosModelResponse = z.object({
    pagination: PaginationModel,
    data: z.array(VendorModel),
});
export const Studios = BackendResponseModel(StudiosModelResponse);
export type IVendorsResponse = z.TypeOf<typeof Studios>;
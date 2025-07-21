import { z } from "zod";
import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { FinanceOverviewModel } from "./common.model";

/**
 * Model of Vendor Overview Response
 */
export const VendorOverviewResponseModel = BackendResponseModel(FinanceOverviewModel);

export type IVendorOverviewResponse = z.infer<typeof VendorOverviewResponseModel>;
//----------------------End----------------------//

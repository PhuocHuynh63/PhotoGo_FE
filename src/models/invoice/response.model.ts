import { PaginationModel } from "@models/metadata";
import { InvoiceModel } from "./common.model";
import { z } from "zod";

/**
 * Single Invoice Response Model
 */
export const InvoiceResponseModel = z.object({
    success: z.boolean(),
    message: z.string(),
    data: InvoiceModel
});
export type IInvoiceResponse = z.TypeOf<typeof InvoiceResponseModel>;
//----------------------End----------------------//

/**
 * Invoice List Response Model
 */
export const InvoiceListResponseModel = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        data: z.array(InvoiceModel),
        pagination: PaginationModel
    })
});

export type IInvoiceListResponse = z.TypeOf<typeof InvoiceListResponseModel>;
//----------------------End----------------------//

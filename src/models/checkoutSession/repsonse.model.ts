import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { CheckoutSessionModel } from "./common.model";

/**
 * Model of CheckoutSessionData
 */
export const CheckoutSessionDataModel = z.object({
    data: CheckoutSessionModel,
    checkoutSessionId: z.string(),
});

export const CheckoutSessionResponseModel = BackendResponseModel(CheckoutSessionDataModel);
export type ICheckoutSessionResponseModel = z.infer<typeof CheckoutSessionResponseModel>;
//----------------------End----------------------//
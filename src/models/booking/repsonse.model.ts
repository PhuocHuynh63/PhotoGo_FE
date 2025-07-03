import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { BookingModel } from "./common.model";

/**
 * Model of BookingData
 */
export const BookingDataModel = z.object({
    data: BookingModel,
});

export const BookingResponseModel = BackendResponseModel(BookingDataModel);
export type IBookingResponseModel = z.infer<typeof BookingResponseModel>;
//----------------------End----------------------//



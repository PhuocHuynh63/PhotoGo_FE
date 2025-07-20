import { BackendResponseModel } from "@models/backend/backendResponse.model";
import { z } from "zod";
import { BookingModel } from "./common.model";

/**
 * Model of BookingData
 */
export const BookingResponseModel = BackendResponseModel(BookingModel);
export type IBookingResponseModel = z.infer<typeof BookingResponseModel>;
//----------------------End----------------------//



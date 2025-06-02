import http from "@configs/fetch";
import { IBookingFormRequest } from "@models/booking/request.model";

const BookingService = {
    createBooking: async (userId: string, serviceConceptId: string, data: any) => {
        return await http.post(`/bookings?userId=${userId}&serviceConceptId=${serviceConceptId}`, data)
    },
}

export default BookingService;

import http from "@configs/fetch";

const BookingService = {
    createBooking: async (userId: string, serviceConceptId: string, data: any) => {
        return await http.post(`/bookings?userId=${userId}&serviceConceptId=${serviceConceptId}`, data)
    },

    getBookingByUserId: async (userId: string, current: number = 1, pageSize: number = 10, sortBy: string = "createdAt", sortDirection: string = "DESC") => {
        return await http.get(`/bookings/user/${userId}?current=${current}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`, {
            next: { revalidate: 10 }
        })
    },

    getBookingById: async (bookingId: string) => {
        return await http.get(`/bookings/${bookingId}`, {
            next: { revalidate: 10 }
        })
    },

    getBookingByPaymentOSId: async (paymentOSId: string) => {
        return await http.get(`/bookings/paymentOSId/${paymentOSId}`, {
            next: { revalidate: 10 }
        })
    }

}

export default BookingService;

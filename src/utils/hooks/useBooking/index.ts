import { useState, useEffect } from 'react';
import { IInvoice } from '@models/invoice/common.model';
import { IBooking } from '@models/booking/common.model';
import BookingService from '@services/booking';
import { IBookingResponseModel } from '@models/booking/repsonse.model';

export const useBooking = (invoices: IInvoice[]) => {
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const bookingPromises = invoices.map(invoice =>
                    BookingService.getBookingById(invoice.bookingId)
                );

                const responses = await Promise.all(bookingPromises) as IBookingResponseModel[];
                const bookingData = responses.map((response, index) => ({
                    ...response.data,
                    invoice: invoices[index],
                    status: invoices[index].status
                }));

                setBookings(bookingData as unknown as IBooking[]);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch bookings'));
            } finally {
                setLoading(false);
            }
        };

        if (invoices && invoices.length > 0) {
            fetchBookings();
        } else {
            setBookings([]);
            setLoading(false);
        }
    }, [invoices]);

    return { bookings, loading, error };
}
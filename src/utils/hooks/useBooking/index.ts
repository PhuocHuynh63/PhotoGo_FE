import { useState, useEffect, useCallback } from 'react';
import { IInvoice } from '@models/invoice/common.model';
import { IBooking, IBookingDiscountAmount } from '@models/booking/common.model';
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

type UseBookingGetDiscountAmountProps = {
    userId: string;
    serviceConceptId: string;
    voucherId: string;
    depositAmount: number;
    depositType: string;
};
export const useBookingGetDiscountAmount = ({ userId, serviceConceptId, voucherId, depositAmount, depositType }: UseBookingGetDiscountAmountProps) => {
    const [price, setPrice] = useState<IBookingDiscountAmount | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchDiscountAmount = useCallback(async () => {
        if (!userId || !serviceConceptId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await BookingService.getDiscountAmount(userId, serviceConceptId, voucherId, depositAmount, depositType) as any;
            setPrice(response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch discount amount'));
        } finally {
            setLoading(false);
        }
    }, [userId, serviceConceptId, voucherId, depositAmount, depositType]);

    useEffect(() => {
        fetchDiscountAmount();
    }, [fetchDiscountAmount]);

    const clearError = () => {
        setError(null);
    }

    return {
        price,
        loading,
        error,
        clearError,
        fetchDiscountAmount
    };
}
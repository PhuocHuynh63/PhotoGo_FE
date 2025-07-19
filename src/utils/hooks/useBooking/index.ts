import { useState, useEffect, useCallback } from 'react';
import { IInvoice } from '@models/invoice/common.model';
import { IBooking, IBookingDiscountAmount } from '@models/booking/common.model';
import BookingService from '@services/booking';
import { IBookingResponseModel } from '@models/booking/repsonse.model';
import { BookingStatus } from '@constants/bookingStatus';

// Enhanced useBooking hook with all booking operations
export const useBooking = (invoices?: IInvoice[]) => {
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [creatingBooking, setCreatingBooking] = useState(false);

    // Fetch bookings by invoices (existing functionality)
    useEffect(() => {
        const fetchBookings = async () => {
            if (!invoices || invoices.length === 0) {
                setBookings([]);
                setLoading(false);
                return;
            }

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

        fetchBookings();
    }, [invoices]);

    // Update booking status
    const updateBookingStatus = useCallback(async (bookingId: string, status: BookingStatus) => {
        setUpdatingStatus(true);
        setError(null);

        try {
            const response = await BookingService.updateBookingStatus(bookingId, status);

            // Update the local bookings state if we have bookings loaded
            if (bookings.length > 0) {
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking.id === bookingId
                            ? { ...booking, status: status as IBooking['status'] }
                            : booking
                    )
                );
            }

            return response;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to update booking status');
            setError(error);
            throw error;
        } finally {
            setUpdatingStatus(false);
        }
    }, [bookings]);

    // Create new booking
    const createBooking = useCallback(async (userId: string, serviceConceptId: string, data: Record<string, unknown>) => {
        setCreatingBooking(true);
        setError(null);

        try {
            const response = await BookingService.createBooking(userId, serviceConceptId, data);
            return response;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to create booking');
            setError(error);
            throw error;
        } finally {
            setCreatingBooking(false);
        }
    }, []);

    // Get booking by ID
    const getBookingById = useCallback(async (bookingId: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await BookingService.getBookingById(bookingId);
            return response;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch booking');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get bookings by user ID
    const getBookingsByUserId = useCallback(async (userId: string, current: number = 1, pageSize: number = 10, sortBy: string = "createdAt", sortDirection: string = "DESC") => {
        setLoading(true);
        setError(null);

        try {
            const response = await BookingService.getBookingByUserId(userId, current, pageSize, sortBy, sortDirection);
            return response;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch user bookings');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get booking by payment OS ID
    const getBookingByPaymentOSId = useCallback(async (paymentOSId: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await BookingService.getBookingByPaymentOSId(paymentOSId);
            return response;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch booking by payment ID');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // State
        bookings,
        loading,
        error,
        updatingStatus,
        creatingBooking,

        // Actions
        updateBookingStatus,
        createBooking,
        getBookingById,
        getBookingsByUserId,
        getBookingByPaymentOSId,
        clearError
    };
};

// Legacy hook for backward compatibility
export const useBookingLegacy = (invoices: IInvoice[]) => {
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
};

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
            const response = await BookingService.getDiscountAmount(userId, serviceConceptId, voucherId, depositAmount, depositType) as { data: IBookingDiscountAmount };
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
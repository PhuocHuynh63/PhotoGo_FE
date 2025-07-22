import { useEffect, useState, useCallback } from 'react';
import locationService from '@/services/locations';

interface UseLocationOverviewProps {
    locationId: string;
    from: string;
    to: string;
}

export interface Booking {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    service: string;
    status: string;
    notes: string;
    time: string;
    alreadyPaid: number;
    remain: number;
    total: number;
    userId: string;
}

export interface Slot {
    date: string;
    time: string | null;
    count: number;
    bookings: Booking[];
}

export interface Stats {
    confirmed: number;
    expectedRevenue: number;
    pending: number;
    total: number;
}

export interface LocationOverviewData {
    slots: Slot[];
    stats: Stats;
    todayBookings: Booking[];
}

export function useLocationOverview({ locationId, from, to }: UseLocationOverviewProps) {
    const [data, setData] = useState<LocationOverviewData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLocationOverview = useCallback(async () => {
        if (!locationId || !from || !to) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await locationService.getLocationOverview(locationId, from, to);
            const responseData = response as { data?: LocationOverviewData } | LocationOverviewData;

            if (responseData && typeof responseData === 'object' && 'data' in responseData) {
                setData(responseData.data || null);
            } else {
                setData(responseData as LocationOverviewData);
            }
        } catch (err) {
            console.error('Error fetching location overview:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch location overview';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [locationId, from, to]);

    useEffect(() => {
        fetchLocationOverview();
    }, [fetchLocationOverview]);

    const refetch = useCallback(() => {
        fetchLocationOverview();
    }, [fetchLocationOverview]);

    return {
        data,
        loading,
        error,
        refetch,
    };
} 
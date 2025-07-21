import { useEffect, useState, useCallback } from 'react';
import overviewService from '@/services/overview';
import { IVendorOverviewRequest } from '@models/overview/request.model';
import { IVendorOverviewResponse } from '@models/overview/response.model';
import { IFinanceOverview } from '@models/overview/common.model';
import { IBookingOverview } from '@models/overview/common.model';

interface UseFinanceOverviewProps {
    locationId: string;
    startDate: string;
    endDate: string;
    type: string;
}

export function useFinanceOverview({ locationId, startDate, endDate, type }: UseFinanceOverviewProps) {
    const [data, setData] = useState<IFinanceOverview | IBookingOverview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFinanceOverview = useCallback(async () => {
        if (!locationId || !startDate || !endDate || !type) return;
        setLoading(true);
        setError(null);
        try {
            const params: IVendorOverviewRequest = {
                locationId,
                startDate,
                endDate,
                type: type as IVendorOverviewRequest["type"],
            };
            const response = await overviewService.getVendorOverview(params) as IVendorOverviewResponse;
            const overviewData = response.data;
            if (type === 'finance') {
                setData(overviewData as unknown as IFinanceOverview);
            } else if (type === 'booking') {
                setData(overviewData as unknown as IBookingOverview);
            } else {
                setData(null);
            }
        } catch (err) {
            console.error('Error fetching finance overview:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch finance overview';
            setError(errorMessage);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [locationId, startDate, endDate, type]);

    useEffect(() => {
        fetchFinanceOverview();
    }, [fetchFinanceOverview]);

    const refetch = useCallback(() => {
        fetchFinanceOverview();
    }, [fetchFinanceOverview]);

    return {
        data,
        loading,
        error,
        refetch,
    };
}
import { useState, useCallback } from 'react';
import voucherService from '@services/voucher';
import { IVoucherFromPoint } from '@models/voucher/common.model';
import { IVoucherFromPointResponseModel } from '@models/voucher/response.model';

export const useVoucherFromPoint = (userId: string | undefined) => {
    const [vouchers, setVouchers] = useState<IVoucherFromPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Pagination states
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 6
    });

    const fetchVouchers = useCallback(async (current = 1, pageSize = 6, status = "hoạt động") => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await voucherService.getVoucherFromPoint(userId, status, "maxPrice", "asc", current, pageSize) as IVoucherFromPointResponseModel;
            console.log(response);
            const data = Array.isArray(response.data?.data)
                ? response.data.data.map(item => item) as IVoucherFromPoint[]
                : [];
            console.log(data);
            setVouchers(data || []);

            // Update pagination info
            if (response.data?.pagination) {
                setPagination({
                    currentPage: current,
                    totalPages: response.data.pagination.totalPage || 1,
                    totalItems: response.data.pagination.totalItem || 0,
                    pageSize
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch vouchers from points'));
            setVouchers([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // Data
        vouchers,

        // Pagination
        pagination,

        // State
        loading,
        error,

        // Fetch functions
        fetchVouchers,

        // Utility functions
        clearError
    };
}; 
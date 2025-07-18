import { useState, useCallback } from 'react';
import voucherService from '@services/voucher';
import { IVoucherResponseModel } from '@models/voucher/response.model';
import { VOUCHER } from '@constants/voucher';
import { IVoucherFilter } from '@models/voucher/common.model';

type UseVoucherProps = {
    userId: string;
    current: number;
    pageSize: number;
    status: string;
    term?: string;
    from?: string;
};

export const useVoucher = ({ userId, current, pageSize, status, from, term }: UseVoucherProps) => {
    const [vouchers, setVouchers] = useState<IVoucherFilter[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: current || 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: pageSize || 6,
    });

    const fetchVouchers = useCallback(
        async (
            fetchCurrent = current || 1,
            fetchPageSize = pageSize || 6,
            fetchStatus = status || VOUCHER.STATUS.AVAILABLE,
            fetchTerm = term || '',
            fetchFrom = from || ''
        ) => {
            if (!userId) return;

            setLoading(true);
            setError(null);

            try {
                const response = await voucherService.getVoucher(
                    userId,
                    fetchCurrent,
                    fetchPageSize,
                    fetchTerm,
                    fetchFrom,
                    fetchStatus,
                    'maxPrice',
                    'asc',
                ) as IVoucherResponseModel;
                
                const data = Array.isArray(response.data?.data)
                    ? (response.data.data as IVoucherFilter[])
                    : [];

                setVouchers(data);

                if (response.data?.pagination) {
                    setPagination({
                        currentPage: fetchCurrent,
                        totalPages: response.data.pagination.totalPage || 1,
                        totalItems: response.data.pagination.totalItem || 0,
                        pageSize: fetchPageSize,
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch vouchers from points'));
                setVouchers([]);
            } finally {
                setLoading(false);
            }
        },
        [userId, current, pageSize, status, from]
    );

    const clearError = useCallback(() => setError(null), []);

    return {
        vouchers,
        pagination,
        loading,
        error,
        fetchVouchers,
        clearError,
    };
};
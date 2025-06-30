import { useState, useCallback } from 'react';
import voucherService from '@services/voucher';
import { IVoucherFromPoint } from '@models/voucher/common.model';
import { IVoucherFromPointResponseModel } from '@models/voucher/response.model';
import { VOUCHER } from '@constants/common';

type UseVoucherProps = {
    userId: string;
    current: number;
    pageSize: number;
    status: string;
};

export const useVoucher = ({ userId, current, pageSize, status }: UseVoucherProps) => {
    const [vouchers, setVouchers] = useState<IVoucherFromPoint[]>([]);
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
            fetchStatus = status || VOUCHER.AVAILABLE
        ) => {
            if (!userId) return;

            setLoading(true);
            setError(null);

            try {
                const response = await voucherService.getVoucherFromPoint(
                    userId,
                    fetchStatus,
                    'maxPrice',
                    'asc',
                    fetchCurrent,
                    fetchPageSize
                ) as IVoucherFromPointResponseModel;

                const data = Array.isArray(response.data?.data)
                    ? (response.data.data as IVoucherFromPoint[])
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
        [userId, current, pageSize, status]
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
import { useState, useCallback } from 'react';
import voucherService from '@services/voucher';
import { IVoucherListResponseModel, IVoucherResponseModel } from '@models/voucher/response.model';
import { VOUCHER } from '@constants/voucher';
import { IVoucherFilter, IVoucherModel } from '@models/voucher/common.model';

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
        current: current || 1,
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
                        current: fetchCurrent,
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

export const useAttachVoucher = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const onAttachVoucher = useCallback(async (voucherId: string, userId: string) => {
        setLoading(true);
        setError(null);
        try {
            await voucherService.attachVoucher(voucherId, userId);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to attach voucher'));
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        loading,
        error,
        onAttachVoucher,
        clearError,
    };
};

export const useAllVouchers = (params: {
    current: number;
    pageSize: number;
    type: string;
    status: string;
    sortBy: string;
    sortDirection: string;
}) => {
    const [vouchers, setVouchers] = useState<IVoucherModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState({
        current: params.current || 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: params.pageSize || 6,
    });
    const fetchAllVouchers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await voucherService.getAllVouchers(
                params.current,
                params.pageSize,
                params.type,
                params.status,
                params.sortBy,
                params.sortDirection
            ) as IVoucherListResponseModel;

            setVouchers(response.data?.data as IVoucherModel[] || []);
            setPagination({
                current: params.current || 1,
                totalPages: response.data?.pagination.totalPage || 1,
                totalItems: response.data?.pagination.totalItem || 0,
                pageSize: params.pageSize || 6,
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch all vouchers'));
            setVouchers([]);
        } finally {
            setLoading(false);
        }
    }, [params]);

    return { vouchers, loading, error, fetchAllVouchers, pagination };
};
'use client';

import { useState, useCallback, useEffect } from 'react';
import invoiceService from '@services/invoice';
import { IInvoiceListResponse } from '@models/invoice/response.model';
import { IInvoiceModel } from '@models/invoice/common.model';
import { IPagination } from '@models/metadata';

type UseInvoiceProps = {
    initInvoices: IInvoiceModel[];
    initPagination: IPagination;
    userId: string;
};

export const useInvoiceByUserId = ({ initInvoices, initPagination, userId }: UseInvoiceProps) => {
    const [listInvoice, setListInvoice] = useState<IInvoiceModel[]>(initInvoices || []);
    const [pagination, setPagination] = useState<IPagination>(initPagination);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setListInvoice(initInvoices);
        setPagination(initPagination);
    }, [initInvoices, initPagination]);

    const fetchInvoiceByUserId = useCallback(
        async (
            fetchCurrent = 1,
            fetchPageSize = 10,
            fetchStatus = '',
            fetchTerm = '',
        ) => {
            if (!userId) return;

            setLoading(true);
            setError(null);

            try {
                const response = await invoiceService.getInvoiceByUserId(
                    userId,
                    fetchCurrent,
                    fetchPageSize,
                ) as IInvoiceListResponse;

                const data = Array.isArray(response.data?.data)
                    ? (response.data.data as IInvoiceModel[])
                    : initInvoices || [];

                setListInvoice(data);

                if (response.data?.pagination) {
                    setPagination({
                        current: fetchCurrent,
                        totalPage: response.data.pagination.totalPage || 1,
                        totalItem: response.data.pagination.totalItem || 6,
                        pageSize: fetchPageSize,
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch vouchers from points'));
                setListInvoice([]);
            } finally {
                setLoading(false);
            }
        },
        [userId]
    );

    const clearError = useCallback(() => setError(null), []);

    return {
        listInvoice,
        pagination,
        loading,
        error,
        fetchInvoiceByUserId,
        clearError,
    };
};
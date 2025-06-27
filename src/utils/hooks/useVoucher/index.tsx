import { useState, useCallback } from 'react';
import voucherService from '@services/voucher';
import { IVoucherFromCampaign, IVoucherFromPoint } from '@models/voucher/common.model';
import { IVoucherFromCampaignResponseModel, IVoucherFromPointResponseModel } from '@models/voucher/response.model';

export const useVoucher = (userId: string | undefined) => {
    const [vouchersFromPoint, setVouchersFromPoint] = useState<IVoucherFromPoint[]>([]);
    const [vouchersFromCampaign, setVouchersFromCampaign] = useState<IVoucherFromCampaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Pagination states
    const [pointPagination, setPointPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 6
    });

    const [campaignPagination, setCampaignPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: 6
    });

    const fetchVouchersFromPoint = useCallback(async (current = 1, pageSize = 6, status = "hoạt động") => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await voucherService.getVoucherFromPoint(userId, status, "maxPrice", "asc", current, pageSize) as IVoucherFromPointResponseModel;
            const data = Array.isArray(response.data?.data)
                ? response.data.data.map(item => item) as IVoucherFromPoint[]
                : [];
            setVouchersFromPoint(data || []);

            // Update pagination info
            if (response.data?.pagination) {
                setPointPagination({
                    currentPage: current,
                    totalPages: response.data.pagination.totalPage || 1,
                    totalItems: response.data.pagination.totalItem || 0,
                    pageSize
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch vouchers from points'));
            setVouchersFromPoint([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const fetchVouchersFromCampaign = useCallback(async (current = 1, pageSize = 6, status = "hoạt động") => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await voucherService.getVoucherFromCampaign(userId, status, "maxPrice", "asc", current, pageSize) as IVoucherFromCampaignResponseModel;
            const data = Array.isArray(response.data?.data)
                ? response.data.data.map(item => item) as IVoucherFromCampaign[]
                : [];
            setVouchersFromCampaign(data || []);

            // Update pagination info
            if (response.data?.pagination) {
                setCampaignPagination({
                    currentPage: current,
                    totalPages: response.data.pagination.totalPage || 1,
                    totalItems: response.data.pagination.totalItem || 0,
                    pageSize
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch vouchers from campaign'));
            setVouchersFromCampaign([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Refresh all vouchers
    const refreshVouchers = useCallback(() => {
        fetchVouchersFromPoint();
        fetchVouchersFromCampaign();
    }, [fetchVouchersFromPoint, fetchVouchersFromCampaign]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // Data
        vouchersFromPoint,
        vouchersFromCampaign,
        allVouchers: [...vouchersFromPoint, ...vouchersFromCampaign],

        // Pagination
        pointPagination,
        campaignPagination,

        // State
        loading,
        error,

        // Fetch functions
        fetchVouchersFromPoint,
        fetchVouchersFromCampaign,

        // Utility functions
        refreshVouchers,
        clearError
    };
};

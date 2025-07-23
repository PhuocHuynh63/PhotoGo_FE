import { IPagination } from "@models/metadata";
import { ISubscriptionModel } from "@models/subscription/common.model";
import { ISubscriptionHistoryModel, ISubscriptionHistoryResponseModel } from "@models/subscription/response.model";
import { subscriptionService } from "@services/subcription";
import { useCallback, useEffect, useState } from "react";

type UseSubscriptionHistoryProps = {
    userId: string;
    current?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    action?: string;
};

export const useSubscriptionHistory = ({ userId, current, pageSize, sortBy, sortDirection, action }: UseSubscriptionHistoryProps) => {
    const [subscriptionHistory, setSubscriptionHistory] = useState<ISubscriptionHistoryModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState<IPagination>({
        current: current || 1,
        totalPage: 1,
        totalItem: 0,
        pageSize: pageSize || 10,
    });

    const fetchSubscriptionHistory = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        const params = {
            current,
            pageSize,
            sortBy,
            sortDirection,
            action
        }

        try {
            const response = await subscriptionService.getSubscriptionHistoryByUserId(userId, params) as { data: ISubscriptionHistoryResponseModel };
            setSubscriptionHistory(response.data.history);
            setPagination({
                current: response.data.pagination.current,
                totalPage: response.data.pagination.totalPage,
                totalItem: response.data.pagination.totalItem,
                pageSize: response.data.pagination.pageSize
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch discount amount'));
        } finally {
            setLoading(false);
        }
    }, [userId, current, pageSize, sortBy, sortDirection, action]);

    useEffect(() => {
        fetchSubscriptionHistory();
    }, [fetchSubscriptionHistory]);

    const clearError = () => {
        setError(null);
    }

    return {
        subscriptionHistory,
        loading,
        error,
        clearError,
        fetchSubscriptionHistory,
        pagination
    };
}
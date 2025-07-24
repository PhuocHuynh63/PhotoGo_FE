import { IPagination } from "@models/metadata";
import { IReviewAllModel } from "@models/review/common.model";
import { IReviewAllResponse, IReviewPaginationResponse } from "@models/review/repsonse.model";
import reviewService from "@services/review";
import { useCallback, useEffect, useState } from "react";

type ReviewByVendorIdParams = {
    vendorId: string;
    current?: number;
    pageSize?: number;
    rating?: number;
    sortBy?: 'rating' | 'created_at';
    sortDirection?: 'asc' | 'desc';
};

export function useReviewsByVendorId({
    vendorId,
    current = 1,
    pageSize,
    rating,
    sortBy,
    sortDirection = 'desc',
}: ReviewByVendorIdParams) {
    const [data, setData] = useState<IReviewPaginationResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        reviewService.getReviewByVendorId(vendorId, current, pageSize!, rating, sortBy, sortDirection)
            .then((response: any) => {
                if (isMounted) {
                    setData(response.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || 'Failed to fetch reviews');
                    setLoading(false);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        }
    }, [vendorId, current, pageSize, rating, sortBy, sortDirection]);

    return {
        data,
        loading,
        error,
    };
}

/**
 * Hook to get all reviews
 */
type UseAllReviewsParams = {
    current?: number;
    pageSize?: number;
    rating?: number;
    sortBy?: 'rating' | 'created_at';
    sortDirection?: 'asc' | 'desc';
}

export function useAllReviews({
    current = 1,
    pageSize,
    rating,
    sortBy,
    sortDirection = 'desc',
}: UseAllReviewsParams) {
    const [data, setData] = useState<IReviewAllModel[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<IPagination>();

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await reviewService.getAllReviews(
                current,
                pageSize,
                rating,
                sortBy,
                sortDirection
            ) as IReviewAllResponse;

            setData(response?.data?.data);
            setPagination(response?.data?.pagination);

        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Failed to fetch reviews');
            }
        } finally {
            setLoading(false);
        }
    }, [current, pageSize, rating, sortBy, sortDirection]);

    useEffect(() => {
        const controller = new AbortController();

        fetchReviews();

        return () => {
            controller.abort();
        };
    }, [fetchReviews]);

    return {
        data,
        loading,
        error,
        pagination,
        fetchReviews,
    };
}
//----------------------End----------------------//
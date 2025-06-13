import { IReviewPaginationResponse } from "@models/review/repsonse.model";
import reviewService from "@services/review";
import { useEffect, useState } from "react";

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
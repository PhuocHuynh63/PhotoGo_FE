import { useState, useCallback } from "react";
import { pointService } from "@services/point";
import { IPoint } from "@models/point/common.model";
import { IPointResponse } from "@models/point/response.model";

export default function usePoint() {
    const [point, setPoint] = useState<IPoint | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const fetchPoint = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await pointService.getPoint() as IPointResponse;
            setPoint(response?.data ?? null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { point, loading, error, refetch: fetchPoint };
}
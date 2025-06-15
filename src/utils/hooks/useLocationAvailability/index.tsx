import { ILocationScheduleResponse } from "@models/locationAvailability/response.model";
import { ILocationSchedule } from "@models/locationAvailability/common.model";
import locationAvailabilityService from "@services/locationAvailability";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type UseLocationAvailabilityParams = {
    locationId: string;
    enabled?: boolean; // Optional flag to control when to fetch
};

export function useLocationAvailability({
    locationId,
    enabled = true,
}: UseLocationAvailabilityParams) {
    const [data, setData] = useState<ILocationSchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkingHours = async () => {
        if (!locationId || !enabled) return;

        setLoading(true);
        setError(null);

        try {
            const result = await locationAvailabilityService.getLocationAvailabilityByLocationId(locationId) as ILocationScheduleResponse;

            if (result.statusCode === 200 && result.data) {
                setData(result.data.data);
            } else {
                setData([]);
                const errorMessage = "Không thể tải dữ liệu lịch làm việc";
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = "Đã xảy ra lỗi khi tải dữ liệu lịch làm việc";
            console.error("Error fetching working hours:", error);
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkingHours();
    }, [locationId, enabled]);

    const refetch = () => {
        fetchWorkingHours();
    };

    return {
        data,
        loading,
        error,
        refetch,
    };
}
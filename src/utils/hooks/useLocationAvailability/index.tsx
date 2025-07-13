import { ILocationScheduleResponse } from "@models/locationAvailability/response.model";
import { ILocationSchedule } from "@models/locationAvailability/common.model";
import locationAvailabilityService from "@services/locationAvailability";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

/**
 * Custom hook to fetch location availability
 * @param {UseLocationAvailabilityParams} params - Parameters for fetching location availability
 * @param {string} params.locationId - The ID of the location to fetch availability for
 */
type UseLocationAvailabilityParams = {
    locationId: string;
    conceptRangeType?: string;
    enabled?: boolean; // Optional flag to control when to fetch
};

export function useLocationAvailability({
    locationId,
    conceptRangeType = 'một ngày',
    enabled = true,
}: UseLocationAvailabilityParams) {
    const [locationAvailability, setLocationAvailability] = useState<ILocationSchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    console.log('>>>>>>>>>>>>>>>>>>>> conceptRangeType', conceptRangeType);

    const fetchWorkingHours = async () => {
        if (!locationId) return;

        setLoading(true);
        setError(null);

        try {
            let result;
            if (conceptRangeType === 'nhiều ngày') {
                result = await locationAvailabilityService.getLocationAvailabilityMultidayByLocationId(locationId) as ILocationScheduleResponse;
            } else {
                result = await locationAvailabilityService.getLocationAvailabilityByLocationId(locationId) as ILocationScheduleResponse;
            }

            if (result.statusCode === 200 && result.data) {
                setLocationAvailability(result.data.data);
            } else {
                setLocationAvailability([]);
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
    }, [locationId, conceptRangeType, enabled]);

    const refetch = () => {
        fetchWorkingHours();
    };

    return {
        locationAvailability,
        loading,
        error,
        refetch,
    };
}
//----------------------------------End----------------------------------//

/**
 * Custom hook to fetch location availability and date
 * @param {UseLocationAvailabilityParams} params - Parameters for fetching location availability
 * @param {string} params.locationId - The ID of the location to fetch availability for
 * @param {string} params.date - The date to fetch availability for
 */
type UseLocationAvailabilityByLocationIdAndDateParams = {
    locationId: string;
    date: string;
};

export function useLocationAvailabilityByLocationIdAndDate({
    locationId,
    date,
}: UseLocationAvailabilityByLocationIdAndDateParams) {
    const [locationAvailabilitySelectDate, setLocationAvailabilitySelectDate] = useState<ILocationSchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkingHoursByDate = async () => {
        if (!locationId || !date) return;

        setLoading(true);
        setError(null);

        try {
            const result = await locationAvailabilityService.getLocationAvailabilityByIdAndDate(locationId, date) as ILocationScheduleResponse;

            if (result.statusCode === 200 && result.data) {
                setLocationAvailabilitySelectDate(result.data.data);
            } else {
                setLocationAvailabilitySelectDate([]);
                const errorMessage = "Không thể tải dữ liệu lịch làm việc cho ngày đã chọn";
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = "Đã xảy ra lỗi khi tải dữ liệu lịch làm việc";
            console.error("Error fetching working hours by date:", error);
            setError(errorMessage);
            toast.error(error.data?.message || errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkingHoursByDate();
    }, [locationId, date]);

    const refetch = () => {
        fetchWorkingHoursByDate();
    };

    return {
        locationAvailabilitySelectDate,
        loading,
        error,
        refetch,
    };
}
//----------------------------------End----------------------------------//
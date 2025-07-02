import { useState } from "react";
import packageService from "@services/packageServices";
import { IServicePackageResponse } from "@models/servicePackages/response.model";

export function useSaveServiceConcept() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveServiceConcept = async (conceptId: string | undefined, data: FormData) => {
        setIsLoading(true);
        setError(null);
        try {
            let response: IServicePackageResponse;
            if (conceptId) {
                response = await packageService.updateServiceConcept(conceptId, data) as IServicePackageResponse;
            } else {
                response = await packageService.createServiceConcept(data) as IServicePackageResponse;
            }
            setIsLoading(false);
            if (response.statusCode === 200 || response.statusCode === 201) {
                return { success: true, response };
            } else {
                setError(response.error || "Có lỗi xảy ra khi lưu gói dịch vụ");
                return { success: false, response };
            }
        } catch (err: unknown) {
            setIsLoading(false);
            setError((err as { message?: string })?.message || "Có lỗi xảy ra khi lưu gói dịch vụ");
            return { success: false, response: null };
        }
    };

    return { saveServiceConcept, isLoading, error };
} 
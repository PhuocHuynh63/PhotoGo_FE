import { useState } from "react";
import packageService from "@services/packageServices";
import { IServicePackageResponse } from "@models/servicePackages/response.model";

export function useSaveServicePackage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveServicePackage = async (serviceId: string, data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await packageService.updatePackage(serviceId, data) as IServicePackageResponse;
      setIsLoading(false);
      if (response.statusCode === 200) {
        return { success: true, response };
      } else {
        setError(response.error || "Có lỗi xảy ra khi cập nhật dịch vụ");
        return { success: false, response };
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setError((err as { message?: string })?.message || "Có lỗi xảy ra khi cập nhật dịch vụ");
      return { success: false, response: null };
    }
  };

  return { saveServicePackage, isLoading, error };
} 
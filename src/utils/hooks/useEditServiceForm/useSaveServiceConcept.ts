import { useState } from "react";
import packageService from "@services/packageServices";
import { IServicePackageResponse } from "@models/servicePackages/response.model";

interface ConceptData {
  id?: string;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  duration: number;
  conceptRangeType: "một ngày" | "nhiều ngày";
  numberOfDays: number;
  serviceTypeIds: string[];
  images: File[];
  originalPrice?: number; // Giá gốc từ DB
  replaceAllImages?: boolean;
  imagesToDelete: string[];
}

export function useSaveServiceConcept() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveServiceConcept = async (conceptData: ConceptData, servicePackageId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", conceptData.name);
      formData.append("description", conceptData.description);

      // Logic tính toán giá
      let priceToSave: number;
      if (conceptData.originalPrice !== undefined && conceptData.price === conceptData.originalPrice) {
        // Nếu giá hiện tại = giá gốc từ DB, lưu giá gốc (đã trừ VAT và hoa hồng)
        // Giá gốc = Giá hiện tại / (1 + 0.05 + 0.3) = Giá hiện tại / 1.35
        priceToSave = Math.round(conceptData.price);
      } else {
        // Nếu giá đã thay đổi, lưu giá mới (đã bao gồm VAT và hoa hồng)
        priceToSave = conceptData.price;
      }

      formData.append("price", priceToSave.toString());
      formData.append("duration", conceptData.duration.toString());
      formData.append("conceptRangeType", conceptData.conceptRangeType);
      formData.append("numberOfDays", conceptData.numberOfDays.toString());
      formData.append("servicePackageId", servicePackageId);
      formData.append("serviceTypeIds", (conceptData.serviceTypeIds || []).join(", "));
      formData.append("status", "hoạt động");
      formData.append("replaceAllImages", conceptData.replaceAllImages ? "true" : "false");
      formData.append("imagesToDelete", conceptData.imagesToDelete.join(","));
      conceptData.images.forEach((image, idx) => {
        if (idx < 10) formData.append("images", image);
      });

      let response: IServicePackageResponse;
      if (conceptData.id) {
        response = await packageService.updateServiceConcept(conceptData.id, formData) as IServicePackageResponse;
      } else {
        response = await packageService.createServiceConcept(formData) as IServicePackageResponse;
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
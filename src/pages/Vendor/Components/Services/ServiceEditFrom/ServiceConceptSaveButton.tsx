import { Button } from "@/components/Atoms/ui/button";
import { useSaveServiceConcept } from "../../../../../utils/hooks/useEditServiceForm/useSaveServiceConcept";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface ServiceConceptSaveButtonProps {
    conceptData: {
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
        replaceAllImages?: boolean;
        imagesToDelete?: string[];
    };
    originalPrice?: number;
    servicePackageId: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function ServiceConceptSaveButton({ conceptData, originalPrice, servicePackageId, onSuccess, onError }: ServiceConceptSaveButtonProps) {
    const { saveServiceConcept, isLoading, error } = useSaveServiceConcept();
    const validateConceptData = (): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Validate required fields
        if (!conceptData.name?.trim()) {
            errors.push("Tên gói dịch vụ là bắt buộc");
        }

        if (!conceptData.description?.trim()) {
            errors.push("Mô tả gói dịch vụ là bắt buộc");
        }

        if (!conceptData.price || conceptData.price <= 0) {
            errors.push("Giá gói dịch vụ phải lớn hơn 0");
        }

        // Validate duration and numberOfDays based on conceptRangeType
        if (conceptData.conceptRangeType === "một ngày") {
            if (!conceptData.duration || conceptData.duration <= 0) {
                errors.push("Thời gian gói dịch vụ phải lớn hơn 0 cho dịch vụ một ngày");
            }
            if (conceptData.numberOfDays !== 1) {
                errors.push("Số ngày phải bằng 1 cho dịch vụ một ngày");
            }
        } else if (conceptData.conceptRangeType === "nhiều ngày") {
            if (conceptData.duration !== 0) {
                errors.push("Thời gian phải bằng 0 cho dịch vụ nhiều ngày");
            }
            if (!conceptData.numberOfDays || conceptData.numberOfDays < 2) {
                errors.push("Số ngày phải lớn hơn hoặc bằng 2 cho dịch vụ nhiều ngày");
            }
        }

        if (!conceptData.serviceTypeIds || conceptData.serviceTypeIds.length === 0) {
            errors.push("Phải chọn ít nhất một loại dịch vụ");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const handleSave = async () => {
        // Validate before saving
        const validation = validateConceptData();
        if (!validation.isValid) {
            const errorMessage = validation.errors.join(", ");
            toast.error(errorMessage);
            if (onError) onError(errorMessage);
            return;
        }

        const conceptDataWithOriginalPrice = {
            ...conceptData,
            originalPrice,
            replaceAllImages: conceptData.replaceAllImages || false,
            imagesToDelete: conceptData.imagesToDelete || []
        };

        const result = await saveServiceConcept(conceptDataWithOriginalPrice, servicePackageId);
        if (result.success) {
            toast.success("Lưu gói dịch vụ thành công!");
            if (onSuccess) onSuccess();
        } else {
            let errorMessage = error || "Có lỗi xảy ra khi lưu gói dịch vụ";

            if (result.response?.message) {
                if (Array.isArray(result.response.message)) {
                    errorMessage = result.response.message.join(", ");
                } else {
                    errorMessage = result.response.message;
                }
            } else if (result.response?.error) {
                errorMessage = result.response.error;
            }

            toast.error(errorMessage);
            if (onError) onError(errorMessage);
        }
    };

    return (
        <Button onClick={handleSave} disabled={isLoading} className="cursor-pointer">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...</> : "Lưu concept này"}
        </Button>
    );
}
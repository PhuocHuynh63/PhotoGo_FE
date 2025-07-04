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
        serviceTypeIds: string[];
        images: File[];
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

        if (!conceptData.duration || conceptData.duration <= 0) {
            errors.push("Thời gian gói dịch vụ phải lớn hơn 0");
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
            originalPrice
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
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...</> : "Lưu gói này"}
        </Button>
    );
}
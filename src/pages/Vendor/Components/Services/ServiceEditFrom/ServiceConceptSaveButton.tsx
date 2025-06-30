import { Button } from "@/components/Atoms/ui/button";
import { useSaveServiceConcept } from "../../../../../utils/hooks/useEditServiceForm/useSaveServiceConcept";
import toast from "react-hot-toast";

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

    const handleSave = async () => {
        const conceptDataWithOriginalPrice = {
            ...conceptData,
            originalPrice
        };
        
        const result = await saveServiceConcept(conceptDataWithOriginalPrice, servicePackageId);
        if (result.success) {
            toast.success("Lưu gói dịch vụ thành công!");
            if (onSuccess) onSuccess();
        } else {
            toast.error(error || "Có lỗi xảy ra khi lưu gói dịch vụ");
            if (onError) onError(error || "Có lỗi xảy ra khi lưu gói dịch vụ");
        }
    };

    return (
        <Button onClick={handleSave} disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Đang lưu..." : "Lưu gói này"}
        </Button>
    );
} 
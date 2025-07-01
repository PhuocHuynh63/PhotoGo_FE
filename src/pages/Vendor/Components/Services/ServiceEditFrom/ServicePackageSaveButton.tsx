import { Button } from "@/components/Atoms/ui/button";
import { useSaveServicePackage } from "../../../../../utils/hooks/useEditServiceForm/useSaveServicePackage";
import toast from "react-hot-toast";

interface ServicePackageSaveButtonProps {
    serviceId: string;
    serviceData: {
        name: string;
        description: string;
        status: string;
        image?: File;
    };
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function ServicePackageSaveButton({ serviceId, serviceData, onSuccess, onError }: ServicePackageSaveButtonProps) {
    const { saveServicePackage, isLoading, error } = useSaveServicePackage();

    const validateServiceData = (): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Validate required fields
        if (!serviceData.name?.trim()) {
            errors.push("Tên dịch vụ là bắt buộc");
        }

        if (!serviceData.description?.trim()) {
            errors.push("Mô tả dịch vụ là bắt buộc");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const handleSave = async () => {
        // Validate before saving
        const validation = validateServiceData();
        if (!validation.isValid) {
            const errorMessage = validation.errors.join(", ");
            toast.error(errorMessage);
            if (onError) onError(errorMessage);
            return;
        }

        const formData = new FormData();
        formData.append("name", serviceData.name || "");
        formData.append("description", serviceData.description || "");
        formData.append("status", serviceData.status || "hoạt động");
        if (serviceData.image) {
            formData.append("image", serviceData.image);
        }
        const result = await saveServicePackage(serviceId, formData);
        if (result.success) {
            toast.success("Cập nhật dịch vụ thành công!");
            if (onSuccess) onSuccess();
        } else {
            let errorMessage = error || "Có lỗi xảy ra khi cập nhật dịch vụ";

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
            {isLoading ? "Đang lưu..." : "Lưu dịch vụ"}
        </Button>
    );
} 
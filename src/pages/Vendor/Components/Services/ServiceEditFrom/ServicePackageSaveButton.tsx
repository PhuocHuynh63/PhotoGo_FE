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

    const handleSave = async () => {
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
            toast.error(error || "Có lỗi xảy ra khi cập nhật dịch vụ");
            if (onError) onError(error || "Có lỗi xảy ra khi cập nhật dịch vụ");
        }
    };

    return (
        <Button onClick={handleSave} disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Đang lưu..." : "Lưu dịch vụ"}
        </Button>
    );
} 
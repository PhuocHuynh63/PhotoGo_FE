import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose } from "@components/Molecules/Dialog";
import Input from "@components/Atoms/Input";
import Label from "@components/Atoms/Label";
import Button from "@components/Atoms/Button";
import { serviceTypeService } from "@services/serviceType";
import { IServiceTypeRequest } from "@models/serviceTypes/request.model";
import TipTapEditor from '@components/Organisms/TipTapEditor';

interface ServiceTypeDialogProps {
    open: boolean;
    onClose: () => void;
    data?: { id: string; name: string; description: string; status?: string } | null;
    onSuccess?: (newItem?: any) => void;
}

const ServiceTypeDialog: React.FC<ServiceTypeDialogProps> = ({ open, onClose, data, onSuccess }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            setName(data.name || "");
            setDescription(data.description || "");
        } else {
            setName("");
            setDescription("");
        }
        setError(null);
    }, [data, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!name.trim()) {
            setError("Tên loại dịch vụ không được bỏ trống");
            return;
        }
        if (!description || description === '<p></p>') {
            setError("Mô tả không được bỏ trống");
            return;
        }
        setLoading(true);
        try {
            const payload: IServiceTypeRequest = {
                name,
                description,
                status: 'hoạt động'
            };
            let newItem = null;
            if (data && data.id) {
                const res = await serviceTypeService.updateServiceType(data.id, payload);
                newItem = res || null;
            } else {
                const res = await serviceTypeService.createServiceType(payload);
                newItem = res || null;
            }
            if (onSuccess) onSuccess(newItem);
            onClose();
        } catch (err: any) {
            setError(err?.message || "Đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6 p-2 w-full max-w-[560px] mx-auto">
                <div className="space-y-2">
                    <Label htmlFor="service-type-name">Tên loại dịch vụ</Label>
                    <Input
                        id="service-type-name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Nhập tên loại dịch vụ"
                        required
                        autoFocus
                    />
                </div>
                <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <TipTapEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Nhập mô tả chi tiết..."
                        className="min-h-[120px]"
                    />
                </div>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        variant="outline"
                        className="border-orange-400 text-orange-500 bg-white hover:bg-orange-50 hover:border-orange-500"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                        className="bg-orange-400 hover:bg-orange-500 text-white border-none"
                    >
                        {data ? "Lưu" : "Thêm"}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ServiceTypeDialog;

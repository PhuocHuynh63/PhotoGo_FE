import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Atoms/ui/dialog";
import { Button } from "@components/Atoms/Button/Button";
import { Input } from "@components/Atoms/Input/Input";
import { Label } from "@components/Atoms/Label/Label";
import TipTapEditor from '@organisms/TipTapEditor';
import DatePicker from "@components/Atoms/DatePicker";
import toast from "react-hot-toast";
import LucideIcon from "@components/Atoms/LucideIcon";
import { ICreateCampaignModel } from '@models/campaign/request.model';
import { campaignService } from '@services/campaign';

interface AddCampaignDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddCampaignDialog({ open, onClose, onSuccess }: AddCampaignDialogProps) {
    const [formData, setFormData] = useState<Partial<ICreateCampaignModel>>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof ICreateCampaignModel, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.startDate || !formData.endDate) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        setIsLoading(true);
        try {
            // Chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY khi gửi lên API
            const formatDateForApi = (dateStr: string) => {
                if (!dateStr) return '';
                const [year, month, day] = dateStr.split('-');
                return `${day}/${month}/${year}`;
            };

            const apiData = {
                ...formData,
                startDate: formatDateForApi(formData.startDate as string),
                endDate: formatDateForApi(formData.endDate as string)
            };

            console.log('Sending to API:', apiData);
            await campaignService.createCampaign(apiData as ICreateCampaignModel);
            toast.success('Tạo campaign thành công');

            // Đóng dialog và reset form
            setFormData({ name: '', description: '', startDate: '', endDate: '' });

            // Gọi onSuccess và tự động làm mới trang sau 500ms
            onSuccess();

            // Thêm reload trang sau khi tạo thành công để đảm bảo dữ liệu mới
            setTimeout(() => {
                window.location.reload();
            }, 300);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo campaign');
            console.error('Error creating campaign:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                        <LucideIcon name="Plus" className="text-blue-600 w-5 h-5" />
                        Thêm campaign mới
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tên campaign *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="VD: Summer Sale 2024"
                                maxLength={100}
                                className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả *</Label>
                            <div className="rounded-lg border border-gray-300 bg-white min-h-[120px] p-2">
                                <TipTapEditor
                                    value={formData.description || ''}
                                    onChange={(value) => handleInputChange('description', value)}
                                    placeholder="Nhập mô tả chương trình khuyến mãi..."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                                <DatePicker
                                    value={formData.startDate ? new Date(formData.startDate) : null}
                                    onChange={(date) => handleInputChange('startDate', date ? date.toLocaleDateString('en-CA') : '')}
                                    placeholder="Chọn ngày bắt đầu"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Ngày kết thúc *</Label>
                                <DatePicker
                                    value={formData.endDate ? new Date(formData.endDate) : null}
                                    onChange={(date) => handleInputChange('endDate', date ? date.toLocaleDateString('en-CA') : '')}
                                    placeholder="Chọn ngày kết thúc"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="min-w-[90px]">
                            Hủy
                        </Button>
                        <Button type="submit" isLoading={isLoading} className="min-w-[110px] font-semibold">
                            Tạo mới
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

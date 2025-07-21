'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/Atoms/ui/dialog";
import { Button } from "@components/Atoms/Button/Button";
import { Input } from "@components/Atoms/Input/Input";
import { Label } from "@components/Atoms/Label/Label";
import TipTapEditor from '@organisms/TipTapEditor';
import Select from "@components/Atoms/Select";
import DatePicker from "@components/Atoms/DatePicker";
import { VOUCHER } from "@constants/voucher";
import { ICreateVoucher } from "@models/voucher/request.model";
import voucherService from "@services/voucher";
import toast from "react-hot-toast";
import LucideIcon from "@components/Atoms/LucideIcon";

interface AddVoucherDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Partial<ICreateVoucher>;
    onBack?: () => void;
}

const DISCOUNT_TYPE_OPTIONS = [
    { value: VOUCHER.DISCOUNT_TYPE.PERCENT, icon: 'Percent', name: 'Phần trăm' },
    { value: VOUCHER.DISCOUNT_TYPE.AMOUNT, icon: 'DollarSign', name: 'Số tiền' },
];

const TYPE_OPTIONS = [
    { value: VOUCHER.TYPE.CAMPAIGN, icon: 'Target', name: 'Chiến dịch' },
    { value: VOUCHER.TYPE.POINT, icon: 'Star', name: 'Điểm' },
    { value: VOUCHER.TYPE.WHEEL, icon: 'Gift', name: 'Vòng quay may mắn' },
];


export default function AddVoucherDialog({ open, onClose, onSuccess, initialData, onBack }: AddVoucherDialogProps) {
    const [formData, setFormData] = useState<Partial<ICreateVoucher>>({
        code: '',
        description: '',
        discount_type: initialData?.discount_type || VOUCHER.DISCOUNT_TYPE.PERCENT,
        discount_value: 0,
        minPrice: 0,
        maxPrice: 0,
        quantity: 1,
        start_date: '',
        end_date: '',
        status: VOUCHER.STATUS.INACTIVE,
        type: initialData?.type || VOUCHER.TYPE.CAMPAIGN,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof ICreateVoucher, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.code || !formData.description || !formData.start_date || !formData.end_date) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setIsLoading(true);
        try {
            await voucherService.createVoucher(formData as ICreateVoucher);
            toast.success('Tạo voucher thành công');
            onSuccess();
            setFormData({
                code: '',
                description: '',
                discount_type: initialData?.discount_type || VOUCHER.DISCOUNT_TYPE.PERCENT,
                discount_value: 0,
                minPrice: 0,
                maxPrice: 0,
                quantity: 1,
                start_date: '',
                end_date: '',
                status: VOUCHER.STATUS.INACTIVE,
            });
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo voucher');
            console.error('Error creating voucher:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto" style={{ maxWidth: '900px', width: '100%' }}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LucideIcon name="Plus" className="text-blue-600" />
                        Thêm voucher mới
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Basic Info & Description */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="code">Mã voucher *</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                    placeholder="VD: SALEHE2024"
                                    maxLength={20}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Số lượng *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                                    placeholder="100"
                                    min={1}
                                    max={1000000}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Loại voucher *</Label>
                                <Select
                                    placeHolder="Chọn loại voucher"
                                    value={formData.type}
                                    onValueChange={(value) => handleInputChange('type', value)}
                                    options={TYPE_OPTIONS}
                                />
                            </div>
                            {formData.type === VOUCHER.TYPE.POINT && (
                                <div className="space-y-2">
                                    <Label htmlFor="point">Số điểm cần để đổi *</Label>
                                    <Input
                                        id="point"
                                        type="number"
                                        value={formData.point || 0}
                                        onChange={(e) => handleInputChange('point', parseInt(e.target.value) || 0)}
                                        placeholder="VD: 100"
                                        min={0}
                                    />
                                </div>
                            )}
                            {formData.type === VOUCHER.TYPE.WHEEL && (
                                <div className="space-y-2">
                                    <Label className="text-pink-600">Voucher này sẽ được phát qua vòng quay may mắn.</Label>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả chi tiết *</Label>
                            <TipTapEditor
                                value={formData.description || ''}
                                onChange={(value) => handleInputChange('description', value)}
                                placeholder="Nhập mô tả, điều kiện áp dụng cho voucher..."
                            />
                        </div>
                    </div>

                    {/* Section 2: Discount Rules */}
                    <div className="border-t pt-6 space-y-4">
                        <h3 className="text-lg font-medium">Quy tắc giảm giá</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="discount_type">Loại giảm giá *</Label>
                                <Select
                                    placeHolder="Chọn loại giảm giá"
                                    value={formData.discount_type}
                                    onValueChange={(value) => handleInputChange('discount_type', value)}
                                    options={DISCOUNT_TYPE_OPTIONS}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount_value">Giá trị giảm *</Label>
                                <Input
                                    id="discount_value"
                                    type="number"
                                    value={formData.discount_value}
                                    onChange={(e) => handleInputChange('discount_value', parseFloat(e.target.value) || 0)}
                                    placeholder={formData.discount_type === VOUCHER.DISCOUNT_TYPE.PERCENT ? "Nhập %" : "Nhập số tiền"}
                                    min={0}
                                    max={formData.discount_type === VOUCHER.DISCOUNT_TYPE.PERCENT ? 100 : undefined}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="minPrice">Áp dụng cho đơn hàng từ (VNĐ)</Label>
                                <Input
                                    id="minPrice"
                                    type="number"
                                    value={formData.minPrice}
                                    onChange={(e) => handleInputChange('minPrice', parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                    min={0}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxPrice">Giảm giá tối đa (VNĐ)</Label>
                                <Input
                                    id="maxPrice"
                                    type="number"
                                    value={formData.maxPrice}
                                    onChange={(e) => handleInputChange('maxPrice', parseFloat(e.target.value) || 0)}
                                    placeholder="Không giới hạn"
                                    min={0}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Date Range */}
                    <div className="border-t pt-6 space-y-4">
                        <h3 className="text-lg font-medium">Thời gian áp dụng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Ngày bắt đầu *</Label>
                                <DatePicker
                                    value={formData.start_date ? new Date(formData.start_date) : null}
                                    onChange={(date) => handleInputChange('start_date', date ? date.toLocaleDateString('en-CA') : '')}
                                    placeholder="Chọn ngày bắt đầu"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date">Ngày kết thúc *</Label>
                                <DatePicker
                                    value={formData.end_date ? new Date(formData.end_date) : null}
                                    onChange={(date) => handleInputChange('end_date', date ? date.toLocaleDateString('en-CA') : '')}
                                    placeholder="Chọn ngày kết thúc"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between gap-3 pt-4 border-t">
                        <div>
                            {onBack && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onBack}
                                    disabled={isLoading}
                                    className="flex items-center gap-2"
                                >
                                    <LucideIcon name="ArrowLeft" className="h-4 w-4" />
                                    Quay lại
                                </Button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="min-w-[120px]"
                            >
                                {isLoading ? (
                                    <>
                                        <LucideIcon name="Loader2" className="mr-2 animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <LucideIcon name="Plus" className="mr-2" />
                                        Tạo voucher
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/Atoms/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Atoms/ui/form';
import { Button } from '@/components/Atoms/Button/Button';
import { Input } from '@/components/Atoms/Input/Input';
import Select from '@/components/Atoms/Select';
import DatePicker from '@/components/Atoms/DatePicker';
import LucideIcon from '@/components/Atoms/LucideIcon';
import TipTapEditor from '@/components/Organisms/TipTapEditor';

import { VOUCHER } from '@/constants/voucher';
import { IVoucherModel } from '@/models/voucher/common.model';
import { IEditVoucher, editVoucherSchema } from '@/models/voucher/request.model';
import voucherService from '@/services/voucher';

interface EditVoucherDialogProps {
    voucher: IVoucherModel;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const DISCOUNT_TYPE_OPTIONS = Object.values(VOUCHER.DISCOUNT_TYPE).map((type) => ({ name: type, value: type }));
const STATUS_OPTIONS = Object.values(VOUCHER.STATUS).map((status) => ({ name: status, value: status }));
const VOUCHER_TYPE_OPTIONS = Object.values(VOUCHER.TYPE).map((type) => ({ name: type, value: type }));

export default function EditVoucherDialog({ voucher, open, onClose, onSuccess }: EditVoucherDialogProps) {
    const form = useForm<IEditVoucher>({
        resolver: zodResolver(editVoucherSchema),
        defaultValues: {
            code: '',
            description: '',
            discount_type: VOUCHER.DISCOUNT_TYPE.PERCENT,
            discount_value: '0',
            minPrice: 0,
            maxPrice: 0,
            quantity: 1,
            start_date: '',
            end_date: '',
            status: VOUCHER.STATUS.INACTIVE,
            type: VOUCHER.TYPE.CAMPAIGN,
            point: 0,
        },
    });

    useEffect(() => {
        if (voucher) {
            form.reset({
                ...voucher,
                discount_value: String(voucher.discount_value),
            });
        }
    }, [voucher, form]);

    const onSubmit = async (values: IEditVoucher) => {
        try {
            const payload = {
                ...values,
                discount_value: parseFloat(values.discount_value),
                minPrice: values.minPrice || 0,
                maxPrice: values.maxPrice || 0,
            };
            await voucherService.editVoucher(voucher.id, payload);
            toast.success('Cập nhật voucher thành công');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi cập nhật voucher');
        }
    };

    const { isSubmitting } = form.formState;
    const watchedType = form.watch('type');

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LucideIcon name="Edit" className="text-blue-600" />
                        Chỉnh sửa voucher
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-6">
                            {/* Section 1: Basic Info */}
                            <div className="p-4 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Mã voucher *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="VD: SALE50" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Mô tả *</FormLabel>
                                                <FormControl>
                                                    <TipTapEditor
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Nhập mô tả chi tiết cho voucher..."
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Section 2: Discount Rules */}
                            <div className="p-4 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Quy tắc giảm giá</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="discount_type"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Loại giảm giá *</FormLabel>
                                                <Select
                                                    placeHolder="Chọn loại giảm giá"
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    options={DISCOUNT_TYPE_OPTIONS}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="discount_value"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Giá trị giảm *</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="VD: 50 hoặc 50000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="minPrice"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="VD: 500000" {...field} onChange={(e: any) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maxPrice"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Giá trị đơn hàng tối đa</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="VD: 2000000" {...field} onChange={(e: any) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Section 3: Date Range */}
                            <div className="p-4 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Thời gian áp dụng</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="start_date"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Ngày bắt đầu *</FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        value={field.value ? new Date(field.value) : null}
                                                        onChange={(date: any) => field.onChange(date?.toISOString())}
                                                        placeholder="Chọn ngày bắt đầu"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="end_date"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Ngày kết thúc *</FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        value={field.value ? new Date(field.value) : null}
                                                        onChange={(date: any) => field.onChange(date?.toISOString())}
                                                        placeholder="Chọn ngày kết thúc"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Section 4: Other Info */}
                            <div className="p-4 border rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Thông tin khác</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Loại voucher *</FormLabel>
                                                <Select
                                                    placeHolder="Chọn loại voucher"
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    options={VOUCHER_TYPE_OPTIONS}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {watchedType !== VOUCHER.TYPE.CAMPAIGN && (
                                        <FormField
                                            control={form.control}
                                            name="point"
                                            render={({ field }: { field: any }) => (
                                                <FormItem>
                                                    <FormLabel>Điểm</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="VD: 100" {...field} onChange={(e: any) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Số lượng *</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="VD: 100" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }: { field: any }) => (
                                            <FormItem>
                                                <FormLabel>Trạng thái *</FormLabel>
                                                <Select
                                                    placeHolder="Chọn trạng thái"
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    options={STATUS_OPTIONS}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                                {isSubmitting ? (
                                    <>
                                        <LucideIcon name="Loader2" className="mr-2 animate-spin" />
                                        Đang lưu...
                                    </> 
                                ) : (
                                    <>
                                        <LucideIcon name="Save" className="mr-2" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
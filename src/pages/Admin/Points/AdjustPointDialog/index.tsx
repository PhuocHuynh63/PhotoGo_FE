import { useState } from 'react';
import Button from '@components/Atoms/Button';
import Input from '@components/Atoms/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/Atoms/ui/dialog';
import toast from 'react-hot-toast';
import { pointService } from '@services/point';
import TipTapEditor from '@organisms/TipTapEditor';

interface AdjustPointDialogProps {
    open: boolean;
    onClose: () => void;
    userId: string;
    onSuccess?: () => void;
}

export default function AdjustPointDialog({ open, onClose, userId, onSuccess }: AdjustPointDialogProps) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'add' | 'subtract'>('add');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        setLoading(true);
        try {
            await pointService.adjustPoint({
                userId,
                amount: Math.abs(Number(amount)),
                description,
                type: type === 'add' ? 'thêm điểm thủ công' : 'trừ điểm thủ công',
            });
            toast.success('Cập nhật điểm thành công!');
            onClose();
            onSuccess?.();
            setAmount('');
            setDescription('');
            setType('add');
        } catch (err: any) {
            toast.error(err?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl w-full rounded-2xl p-6 md:p-8">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold mb-2">Cập nhật </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Số điểm <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            min={1}
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="Nhập số điểm"
                            required
                            className="w-full h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ring-0 shadow-none outline-none transition text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Mô tả <span className="text-red-500">*</span></label>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 min-h-[120px]">
                            <TipTapEditor
                                value={description}
                                onChange={setDescription}
                                placeholder="Nhập lý do điều chỉnh điểm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Loại điều chỉnh</label>
                        <div className="flex gap-6 mt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="add"
                                    checked={type === 'add'}
                                    onChange={() => setType('add')}
                                    className="accent-blue-600 w-5 h-5"
                                />
                                <span className="font-semibold text-gray-700">Thêm điểm</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="subtract"
                                    checked={type === 'subtract'}
                                    onChange={() => setType('subtract')}
                                    className="accent-red-500 w-5 h-5"
                                />
                                <span className="font-semibold text-gray-700">Trừ điểm</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="min-w-[100px] h-12 rounded-xl bg-gray-100 text-gray-700 font-bold shadow hover:bg-gray-200"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loading}
                            className="min-w-[120px] h-12 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700"
                        >
                            Xác nhận
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

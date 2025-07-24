'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { IPointTransaction } from '@models/point/common.model';
import { IPagination } from '@models/metadata';
import Button from '@components/Atoms/Button';
import LucideIcon from '@components/Atoms/LucideIcon';
import { DataTable } from '@components/Organisms/Table/data-table';
import Input from '@components/Atoms/Input';
import { ReactNode, useRef, useEffect } from 'react';
import AdjustPointDialog from '../AdjustPointDialog';
import { useState } from 'react';
import { pointService } from '@services/point';

interface Props {
    userId: string;
    transactions: IPointTransaction[];
    pagination: IPagination;
}

const TYPE_OPTIONS = [
    { value: '', name: 'Tất cả' },
    { value: 'kiếm được', name: 'Kiếm được' },
    { value: 'đổi thưởng', name: 'Đổi thưởng' },
    { value: 'hết hạn', name: 'Hết hạn' },
    { value: 'thêm điểm thủ công', name: 'Thêm điểm thủ công' },
    { value: 'trừ điểm thủ công', name: 'Trừ điểm thủ công' },
];

const TYPE_BADGE: Record<string, { color: string; icon: ReactNode }> = {
    'kiếm được': { color: 'bg-green-100 text-green-700', icon: <LucideIcon name="PlusCircle" iconSize={16} className="mr-1" /> },
    'đổi thưởng': { color: 'bg-blue-100 text-blue-700', icon: <LucideIcon name="Gift" iconSize={16} className="mr-1" /> },
    'hết hạn': { color: 'bg-gray-100 text-gray-500', icon: <LucideIcon name="Clock" iconSize={16} className="mr-1" /> },
    'thêm điểm thủ công': { color: 'bg-yellow-100 text-yellow-700', icon: <LucideIcon name="UserPlus" iconSize={16} className="mr-1" /> },
    'trừ điểm thủ công': { color: 'bg-red-100 text-red-700', icon: <LucideIcon name="MinusCircle" iconSize={16} className="mr-1" /> },
};

function PointHistoryTable({ userId, filter, onPageChange }: { userId: string; filter: Record<string, any>; onPageChange: (page: number) => void }) {
    const [transactions, setTransactions] = useState<IPointTransaction[]>([]);
    const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, totalItem: 0, totalPage: 1 });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filter).forEach(([key, value]) => {
                if (value) params.set(key, String(value));
            });
            const res: any = await pointService.getPointHistory(userId, params);
            setTransactions(res && res.data && res.data.data ? res.data.data : []);
            setPagination(res && res.data && res.data.pagination ? res.data.pagination : { current: 1, pageSize: 10, totalItem: 0, totalPage: 1 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [JSON.stringify(filter), userId]);

    const columns = [
        {
            id: 'description',
            header: 'Mô tả',
            cell: (tx: IPointTransaction) => <span dangerouslySetInnerHTML={{ __html: tx.description }} />,
        },
        {
            id: 'amount',
            header: 'Số điểm',
            cell: (tx: IPointTransaction) => (
                <span className={tx.amount > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                </span>
            ),
        },
        {
            id: 'type',
            header: 'Loại',
            cell: (tx: IPointTransaction) => {
                const badge = TYPE_BADGE[tx.type] || { color: 'bg-gray-100 text-gray-500', icon: null };
                return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                        {badge.icon}{tx.type}
                    </span>
                );
            },
        },
        {
            id: 'created_at',
            header: 'Ngày',
            cell: (tx: IPointTransaction) => new Date(tx.created_at).toLocaleDateString('vi-VN'),
        },
    ];

    return (
        <div className="rounded-xl shadow-md bg-white overflow-hidden">
            <DataTable
                columns={columns}
                data={transactions}
                keyExtractor={tx => tx.id}
                pagination={pagination?.totalItem && pagination.totalItem > 0 ? {
                    currentPage: pagination?.current || 1,
                    totalPages: pagination?.totalPage || 1,
                    totalItems: pagination?.totalItem || 0,
                    onPageChange: onPageChange, // Sử dụng hàm truyền từ cha
                    itemsPerPage: pagination?.pageSize || 10,
                } : undefined}
                emptyState={
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <LucideIcon name="FileQuestion" iconSize={40} className="text-gray-300 mb-3" />
                        <div className="text-lg font-medium text-gray-700 mb-1">Không có lịch sử điểm nào</div>
                        <div className="text-gray-400 text-sm">Hãy thử thay đổi bộ lọc hoặc kiểm tra lại dữ liệu</div>
                    </div>
                }
                isLoading={loading}
            />
        </div>
    );
}

export default function PointsHistoryPage({ userId, transactions, pagination }: Props) {
    const router = useRouter();
    const searchParamsRaw = useSearchParams();
    const safeSearchParams = searchParamsRaw ?? new URLSearchParams();
    const type = safeSearchParams.get('type') || '';
    const startDate = safeSearchParams.get('startDate') || '';
    const endDate = safeSearchParams.get('endDate') || '';
    const minAmount = safeSearchParams.get('minAmount') || '';
    const maxAmount = safeSearchParams.get('maxAmount') || '';
    const current = Number(safeSearchParams.get('current') || pagination?.current || 1);
    const pageSize = Number(safeSearchParams.get('pageSize') || pagination?.pageSize || 10);

    const filterFormRef = useRef<HTMLFormElement>(null);
    const [openAdjust, setOpenAdjust] = useState(false);
    const [tableKey, setTableKey] = useState(0);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const params = new URLSearchParams();
        if (form.type.value) params.set('type', form.type.value);
        if (form.startDate.value) params.set('startDate', form.startDate.value);
        if (form.endDate.value) params.set('endDate', form.endDate.value);
        if (form.minAmount.value) params.set('minAmount', form.minAmount.value);
        if (form.maxAmount.value) params.set('maxAmount', form.maxAmount.value);
        params.set('current', '1');
        params.set('pageSize', String(pageSize));
        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        if (filterFormRef.current) {
            filterFormRef.current.reset();
        }
        router.push('?current=1&pageSize=' + pageSize);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(safeSearchParams.toString());
        params.set('current', String(page));
        params.set('pageSize', String(pageSize));
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-4xl mx-auto px-6 mb-6">
                <div className="flex items-center gap-3 mb-6 justify-between">
                    <div className="flex items-center gap-3">
                        <Button icon="ArrowLeft" onClick={() => router.push('/admin/points')} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                            Quay lại
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Lịch sử điểm người dùng</h1>
                    </div>
                    <Button icon="Plus" onClick={() => setOpenAdjust(true)} className="bg-green-600 text-white font-bold shadow hover:bg-green-700 rounded-xl h-12 px-6 text-base">
                        Cập nhật
                    </Button>
                </div>
                <AdjustPointDialog
                    open={openAdjust}
                    onClose={() => setOpenAdjust(false)}
                    userId={userId}
                    onSuccess={() => {
                        setOpenAdjust(false);
                        setTableKey(k => k + 1); // trigger refetch bảng
                    }}
                />
                {/* Form filter nâng cao */}
                <form
                    ref={filterFormRef}
                    onSubmit={handleFilter}
                    className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Loại giao dịch</label>
                            <select
                                name="type"
                                defaultValue={type}
                                className="w-full h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ring-0 shadow-none outline-none transition"
                            >
                                {TYPE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Từ ngày</label>
                            <input
                                name="startDate"
                                type="date"
                                defaultValue={startDate}
                                className="w-full h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ring-0 shadow-none outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Đến ngày</label>
                            <input
                                name="endDate"
                                type="date"
                                defaultValue={endDate}
                                className="w-full h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ring-0 shadow-none outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Điểm tối thiểu</label>
                            <input
                                name="minAmount"
                                type="number"
                                min={0}
                                defaultValue={minAmount}
                                className="w-full h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ring-0 shadow-none outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Điểm tối đa</label>
                            <input
                                name="maxAmount"
                                type="number"
                                min={0}
                                defaultValue={maxAmount}
                                className="w-full h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ring-0 shadow-none outline-none transition"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-6 justify-end">
                        <Button
                            icon="Search"
                            type="submit"
                            className="bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 rounded-xl h-12 px-8 text-base"
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            icon="RotateCcw"
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-100 text-gray-700 font-bold shadow hover:bg-gray-200 rounded-xl h-12 px-8 text-base"
                        >
                            Đặt lại
                        </Button>
                    </div>
                </form>
                <PointHistoryTable key={tableKey} userId={userId} filter={{ type, startDate, endDate, minAmount, maxAmount, current, pageSize }} onPageChange={handlePageChange} />
            </div>
        </div>
    );
} 
"use client";

import React, { useState, useEffect } from "react";
import ServiceTypeDialog from "./components/ServiceTypeDialog";
import { serviceTypeService } from "@services/serviceType";
import { DataTable, Column } from "@components/Organisms/Table/data-table";
import { Badge } from "@components/Atoms/Badge";
import LucideIcon from "@components/Atoms/LucideIcon";
import { Button } from "@components/Atoms/Button/Button";
import Input from "@components/Atoms/Input";
import Label from "@components/Atoms/Label";
import Select from "@components/Atoms/Select";
import Pagination from "@components/Organisms/Pagination/Pagination";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@components/Molecules/Dialog";
import { Switch } from "@components/Atoms/ui/switch";
import { X, SlidersHorizontal, Search, Filter } from "lucide-react";

interface IServiceTypeItem {
    id: string;
    name: string;
    description: string;
    status?: string;
    packageCount?: number;
    conceptCount?: number;
}

const statusOptions = [
    { value: "all", name: "Tất cả" },
    { value: "hoạt động", name: "Hoạt động" },
    { value: "không hoạt động", name: "Không hoạt động" },
];

const sortByOptions = [
    { value: "default", name: "Mặc định" },
    { value: "name", name: "Tên" },
    { value: "created_at", name: "Ngày tạo" },
    { value: "concept_count", name: "Số concept" },
    { value: "package_count", name: "Số gói dịch vụ" },
];

const sortDirectionOptions = [
    { value: "default", name: "Mặc định" },
    { value: "asc", name: "Tăng dần" },
    { value: "desc", name: "Giảm dần" },
];

interface AdminSettingsServiceTypesPageProps {
    serviceTypes?: IServiceTypeItem[];
    pagination?: { totalItem?: number };
}

export default function AdminSettingsServiceTypesPage({ serviceTypes, pagination }: AdminSettingsServiceTypesPageProps) {
    const [localServiceTypes, setLocalServiceTypes] = useState<IServiceTypeItem[]>(serviceTypes || []);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editData, setEditData] = useState<IServiceTypeItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterName, setFilterName] = useState("");
    // State filter thực tế
    const [filterStatus, setFilterStatus] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [sortDirection, setSortDirection] = useState("default");
    // State tạm cho filter nâng cao
    const [pendingFilter, setPendingFilter] = useState({
        filterStatus: "",
        sortBy: "default",
        sortDirection: "default"
    });
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(pagination?.totalItem || 0);
    const [showFilters, setShowFilters] = useState(false);
    const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);

    const handleToggleFilter = () => {
        if (!showFilters) {
            setPendingFilter({
                filterStatus,
                sortBy,
                sortDirection
            });
        }
        setShowFilters(v => !v);
    };
    const handleApplyFilters = () => {
        setFilterStatus(pendingFilter.filterStatus);
        setSortBy(pendingFilter.sortBy);
        setSortDirection(pendingFilter.sortDirection);
        setPage(1);
        fetchList();
        // Không đóng filter nâng cao sau khi áp dụng
    };
    const handleResetFilters = () => {
        setPendingFilter({
            filterStatus: "all",
            sortBy: "default",
            sortDirection: "default"
        });
        setFilterStatus("all");
        setSortBy("default");
        setSortDirection("default");
        setPage(1);
        fetchList();
        // KHÔNG đóng filter nâng cao, giữ nguyên setShowFilters
    };

    const fetchList = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterName) params.append("name", filterName);
            if (filterStatus && filterStatus !== "all") params.append("status", filterStatus);
            if (sortBy && sortBy !== "default") params.append("sortBy", sortBy);
            if (sortDirection && sortDirection !== "default") params.append("sortDirection", sortDirection);
            params.append("current", page.toString());
            params.append("pageSize", pageSize.toString());
            params.append("showAll", "true");
            const res = await serviceTypeService.getServiceTypesWithFilter(params);
            let data: any = undefined;
            if (res && typeof res === 'object' && res !== null && 'data' in res) {
                data = (res as { data?: any }).data;
            }
            let dataList: IServiceTypeItem[] = [];
            let paginationTotal = 0;
            if (data && Array.isArray(data.data)) {
                dataList = data.data;
                paginationTotal = data.pagination?.totalItem || 0;
            }
            setLocalServiceTypes(dataList);
            setTotal(paginationTotal);
        } catch {
            setLocalServiceTypes([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    // useEffect chỉ fetch khi filter thực tế đổi
    useEffect(() => {
        fetchList();
        // eslint-disable-next-line
    }, [filterName, filterStatus, sortBy, sortDirection, page, pageSize]);

    // Handler mở dialog thêm mới
    const handleOpenAdd = () => {
        setEditData(null);
        setOpenDialog(true);
    };
    // Handler mở dialog sửa
    const handleOpenEdit = (item: IServiceTypeItem) => {
        setEditData(item);
        setOpenDialog(true);
    };
    // Handler đóng dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditData(null);
    };
    // Handler thành công khi thêm/sửa
    const handleSuccessDialog = (newItem?: IServiceTypeItem) => {
        if (newItem) {
            if (editData) {
                // Sửa
                setLocalServiceTypes(prev => prev.map(i => i.id === newItem.id ? newItem : i));
            } else {
                // Thêm mới
                setLocalServiceTypes(prev => [newItem, ...prev]);
            }
        }
        setOpenDialog(false);
        setEditData(null);
    };

    // Handler đổi trạng thái
    const handleToggleStatus = async (item: IServiceTypeItem) => {
        setToggleLoadingId(item.id);
        // Gọi API toggle nếu có
        try {
            await serviceTypeService.toggleServiceType(item.id);
            setLocalServiceTypes(prev => prev.map(i => i.id === item.id ? { ...i, status: i.status === 'hoạt động' ? 'không hoạt động' : 'hoạt động' } : i));
        } catch {
            // TODO: Hiển thị thông báo lỗi nếu cần
        } finally {
            setToggleLoadingId(null);
        }
    };



    // Định nghĩa columns cho DataTable
    const columns: Column<IServiceTypeItem>[] = [
        {
            id: 'name',
            header: 'Tên loại dịch vụ',
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{item?.name}</span>
                    <span className="text-xs text-slate-500">ID: {item?.id}</span>
                </div>
            )
        },
        {
            id: 'description',
            header: 'Mô tả',
            cell: (item) => (
                <div className="max-w-xs">
                    <p className="text-slate-600 text-sm line-clamp-2" title={item?.description}>
                        {item?.description}
                    </p>
                </div>
            )
        },
        {
            id: 'packageCount',
            header: 'Số package',
            cell: (item) => (
                <div className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item?.packageCount ?? 0}
                    </span>
                </div>
            )
        },
        {
            id: 'conceptCount',
            header: 'Số concept',
            cell: (item) => (
                <div className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {item?.conceptCount ?? 0}
                    </span>
                </div>
            )
        },
        {
            id: 'status',
            header: 'Trạng thái',
            cell: (item) => (
                <div className="flex items-center gap-2">
                    {toggleLoadingId === item?.id ? (
                        <div className="flex items-center gap-2">
                            <LucideIcon name="Loader2" className="animate-spin" iconSize={16} />
                            <span className="text-xs text-slate-500">Đang cập nhật...</span>
                        </div>
                    ) : (
                        <Switch
                            checked={item?.status === 'hoạt động'}
                            onCheckedChange={() => handleToggleStatus(item)}
                            disabled={toggleLoadingId === item?.id}
                        />
                    )}
                </div>
            )
        },
        {
            id: 'actions',
            header: 'Thao tác',
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                        title="Chỉnh sửa"
                        className="hover:bg-blue-50 hover:border-blue-200"
                    >
                        <LucideIcon name="Edit" iconSize={16} />
                    </Button>

                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header với gradient background */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Quản lý loại dịch vụ</h1>
                            <p className="text-orange-100 mt-2 text-lg">
                                Quản lý và tổ chức các loại dịch vụ trong hệ thống
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-2xl font-bold">{localServiceTypes.length}</div>
                                <div className="text-orange-100 text-sm">Tổng loại dịch vụ</div>
                            </div>
                            <Button
                                variant="default"
                                onClick={handleOpenAdd}
                                className="bg-white text-orange-600 hover:bg-orange-50 shadow-md"
                            >
                                <LucideIcon name="Plus" className="mr-2" />
                                Thêm loại dịch vụ
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Search và Filter Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-wrap gap-4 items-end justify-between mb-4">
                        <div className="flex-1 min-w-[280px] max-w-[500px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    value={filterName}
                                    onChange={e => setFilterName(e.target.value)}
                                    placeholder="Tìm kiếm theo tên loại dịch vụ..."
                                    className="pl-10"
                                    style={{ minWidth: 280, width: '100%', maxWidth: 500 }}
                                />
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <Button
                                variant="outline"
                                onClick={handleToggleFilter}
                                className={`whitespace-nowrap transition-all duration-200 ${showFilters
                                    ? 'bg-orange-50 border-orange-200 text-orange-700'
                                    : 'hover:bg-slate-50'
                                    }`}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                {showFilters ? "Ẩn bộ lọc" : "Bộ lọc nâng cao"}
                            </Button>
                        </div>
                    </div>

                    {/* Bộ lọc nâng cao */}
                    {showFilters && (
                        <div className="border border-orange-200 rounded-xl p-6 bg-orange-50/50 shadow-sm">
                            <div className="flex flex-wrap items-center gap-4 justify-center mb-6">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium text-slate-700">Trạng thái</Label>
                                    <Select
                                        value={pendingFilter.filterStatus}
                                        onValueChange={v => setPendingFilter(p => ({ ...p, filterStatus: v }))}
                                        options={statusOptions}
                                        placeHolder="Chọn trạng thái"
                                        style={{ minWidth: 160, height: 44 }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium text-slate-700">Sắp xếp theo</Label>
                                    <Select
                                        value={pendingFilter.sortBy}
                                        onValueChange={v => setPendingFilter(p => ({ ...p, sortBy: v }))}
                                        options={sortByOptions}
                                        placeHolder="Chọn tiêu chí"
                                        style={{ minWidth: 160, height: 44 }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium text-slate-700">Thứ tự</Label>
                                    <Select
                                        value={pendingFilter.sortDirection}
                                        onValueChange={v => setPendingFilter(p => ({ ...p, sortDirection: v }))}
                                        options={sortDirectionOptions}
                                        placeHolder="Chọn thứ tự"
                                        style={{ minWidth: 160, height: 44 }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <Button
                                    onClick={handleApplyFilters}
                                    className="px-8 py-2 rounded-lg text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-colors"
                                >
                                    <LucideIcon name="Check" className="mr-2" />
                                    Áp dụng bộ lọc
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="px-8 py-2 rounded-lg text-base font-semibold hover:bg-slate-50"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Đặt lại
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dialog thêm/sửa loại dịch vụ */}
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                <LucideIcon name="Settings" className="text-orange-600" />
                                {editData ? "Chỉnh sửa loại dịch vụ" : "Thêm loại dịch vụ mới"}
                            </DialogTitle>
                        </DialogHeader>
                        <ServiceTypeDialog
                            open={openDialog}
                            onClose={handleCloseDialog}
                            data={editData}
                            onSuccess={handleSuccessDialog}
                        />
                    </DialogContent>
                </Dialog>

                {/* DataTable với card wrapper */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Danh sách loại dịch vụ</h2>
                        <p className="text-slate-600 mt-1">Quản lý tất cả loại dịch vụ trong hệ thống</p>
                    </div>
                    <DataTable<IServiceTypeItem>
                        columns={columns}
                        data={localServiceTypes}
                        keyExtractor={item => item.id}
                        isLoading={loading}
                        pagination={{
                            currentPage: page,
                            totalPages: Math.ceil(total / pageSize),
                            totalItems: total,
                            onPageChange: setPage,
                            itemsPerPage: pageSize,
                        }}
                        emptyState={
                            <div className="text-center py-12">
                                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LucideIcon name="Package" className="text-slate-400" iconSize={32} />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-2">Chưa có loại dịch vụ nào</h3>
                                <p className="text-slate-500 mb-4">Bắt đầu bằng cách tạo loại dịch vụ đầu tiên</p>
                                <Button variant="default" onClick={handleOpenAdd} className="bg-orange-500 hover:bg-orange-600">
                                    <LucideIcon name="Plus" className="mr-2" />
                                    Tạo loại dịch vụ đầu tiên
                                </Button>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
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
import { X, SlidersHorizontal } from "lucide-react";

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
        // Gọi API toggle nếu có
        try {
            await serviceTypeService.toggleServiceType(item.id);
            setLocalServiceTypes(prev => prev.map(i => i.id === item.id ? { ...i, status: i.status === 'hoạt động' ? 'không hoạt động' : 'hoạt động' } : i));
        } catch {
            // TODO: Hiển thị thông báo lỗi nếu cần
        }
    };

    // Định nghĩa columns cho DataTable
    const columns: Column<IServiceTypeItem>[] = [
        {
            id: 'name',
            header: 'Tên loại dịch vụ',
            cell: (item) => <span className="font-medium">{item?.name}</span>
        },
        {
            id: 'description',
            header: 'Mô tả',
            cell: (item) => <span className="text-gray-600 max-w-xs truncate" title={item?.description}>{item?.description}</span>
        },
        {
            id: 'packageCount',
            header: 'Số package',
            cell: (item) => <span className="text-center">{item?.packageCount ?? 0}</span>
        },
        {
            id: 'conceptCount',
            header: 'Số concept',
            cell: (item) => <span className="text-center">{item?.conceptCount ?? 0}</span>
        },
        {
            id: 'status',
            header: 'Trạng thái',
            cell: (item) => (
                <Switch
                    checked={item.status === 'hoạt động'}
                    onCheckedChange={() => handleToggleStatus(item)}
                />
            )
        },
        {
            id: 'actions',
            header: 'Thao tác',
            cell: (item) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(item)}
                    title="Chỉnh sửa"
                >
                    <LucideIcon name="Edit" iconSize={16} />
                </Button>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Tiêu đề và nút thêm mới */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý loại dịch vụ</h1>
                    <p className="text-gray-600 mt-1">Danh sách các loại dịch vụ trong hệ thống</p>
                </div>
                <div>
                    <Button variant="default" onClick={handleOpenAdd}>
                        <LucideIcon name="Plus" className="mr-1" /> Thêm loại dịch vụ
                    </Button>
                </div>
            </div>

            {/* Search + nút bộ lọc */}
            <div className="flex flex-wrap gap-4 mb-4 items-end justify-between">
                <div className="flex-1 min-w-[220px] max-w-[500px]">
                    <Input
                        value={filterName}
                        onChange={e => setFilterName(e.target.value)}
                        placeholder="Tìm kiếm theo tên loại dịch vụ"
                        style={{ minWidth: 220, width: '100%', maxWidth: 500 }}
                    />
                </div>
                <div className="flex-shrink-0">
                    <Button variant="outline" onClick={handleToggleFilter} className="whitespace-nowrap">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
                    </Button>
                </div>
            </div>
            {/* Bộ lọc nâng cao */}
            {showFilters && (
                <div className="border rounded-xl p-8 mb-4 bg-gray-50 flex flex-col items-center shadow-sm">
                    {/* <div className="text-base font-semibold mb-4 text-gray-700">Bộ lọc nâng cao</div> */}
                    <div className="flex flex-wrap items-center gap-4 justify-center mb-6">
                        <Select
                            value={pendingFilter.filterStatus}
                            onValueChange={v => setPendingFilter(p => ({ ...p, filterStatus: v }))}
                            options={statusOptions}
                            placeHolder="Trạng thái"
                            style={{ minWidth: 160, height: 44 }}
                        />
                        <span className="mx-2 text-gray-300 text-2xl select-none flex items-center h-10">|</span>
                        <Select
                            value={pendingFilter.sortBy}
                            onValueChange={v => setPendingFilter(p => ({ ...p, sortBy: v }))}
                            options={sortByOptions}
                            placeHolder="Mặc định"
                            style={{ minWidth: 160, height: 44 }}
                        />
                        <Select
                            value={pendingFilter.sortDirection}
                            onValueChange={v => setPendingFilter(p => ({ ...p, sortDirection: v }))}
                            options={sortDirectionOptions}
                            placeHolder="Mặc định"
                            style={{ minWidth: 160, height: 44 }}
                        />
                    </div>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={handleApplyFilters} className="px-8 py-2 rounded-lg text-base font-semibold bg-orange-400 hover:bg-orange-500 text-white shadow">
                            Áp dụng
                        </Button>
                        <Button variant="outline" onClick={handleResetFilters} className="px-8 py-2 rounded-lg text-base font-semibold">
                            <X className="h-4 w-4 mr-2" />Đặt lại
                        </Button>
                    </div>
                </div>
            )}

            {/* Dialog thêm/sửa loại dịch vụ */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center text-orange-500 mt-4 mb-6">
                            {editData ? "Chỉnh sửa loại dịch vụ" : "Thêm loại dịch vụ"}
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

            {/* DataTable */}
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
                    <div className="text-center py-8">
                        <LucideIcon name="FolderOpen" className="mx-auto mb-4 text-gray-400" iconSize={48} />
                        <p className="text-gray-500">Không có loại dịch vụ nào</p>
                    </div>
                }
            />
        </div>
    );
}
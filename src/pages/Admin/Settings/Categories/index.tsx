'use client';

import { ICategory } from "@models/category/common.model";
import { IPagination } from "@models/metadata";
import { DataTable, Column } from "@components/Organisms/Table/data-table";
import { Badge } from "@components/Atoms/Badge";
import LucideIcon from "@components/Atoms/LucideIcon";
import { Switch } from "@components/Atoms/ui/switch";
import { Button } from "@components/Atoms/Button/Button";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@components/Molecules/Dialog";
import Input from "@components/Atoms/Input";
import TextArea from "@components/Atoms/TextArea";

interface AdminCategoriesPageProps {
    categories: ICategory[];
    pagination: IPagination;
}

export default function AdminCategoriesPage({ categories, pagination }: AdminCategoriesPageProps) {
    // State để quản lý trạng thái bật/tắt tạm thời trên UI
    const [localCategories, setLocalCategories] = useState(categories);
    const [openCreate, setOpenCreate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        isPublic: true,
    });

    // Handler đổi trạng thái switcher
    const handleToggleStatus = (id: string) => {
        setLocalCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, isPublic: !cat.isPublic } : cat
        ));
        // TODO: Gọi API cập nhật trạng thái ở đây nếu cần
    };

    // Handler edit
    const handleEdit = (category: ICategory) => {
        // TODO: Hiển thị dialog chỉnh sửa
        alert(`Chỉnh sửa danh mục: ${category.name}`);
    };

    // Handler tạo mới
    const handleCreate = () => {
        setOpenCreate(true);
    };

    // Handler submit tạo mới
    const handleSubmitCreate = () => {
        setIsSubmitting(true);
        // TODO: Gọi API tạo mới danh mục ở đây
        setTimeout(() => {
            setLocalCategories(prev => [
                { ...formData },
                ...prev,
            ]);
            setIsSubmitting(false);
            setOpenCreate(false);
            setFormData({ id: '', name: '', description: '', isPublic: true });
        }, 800);
    };

    // Status badge component
    const statusBadge = (isPublic: boolean) => {
        return isPublic ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
                <LucideIcon name="CheckCircle" className="mr-1" iconSize={12} />
                Công khai
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                <LucideIcon name="PauseCircle" className="mr-1" iconSize={12} />
                Riêng tư
            </Badge>
        );
    };

    // Define columns for DataTable
    const columns: Column<ICategory>[] = [
        {
            id: 'id',
            header: 'ID',
            cell: (category) => (
                <span className="font-mono text-sm text-gray-500">{category.id}</span>
            )
        },
        {
            id: 'name',
            header: 'Tên danh mục',
            cell: (category) => (
                <span className="font-medium">{category.name}</span>
            )
        },
        {
            id: 'description',
            header: 'Mô tả',
            cell: (category) => (
                <span className="text-gray-600 max-w-xs truncate" title={category.description}>
                    {category.description}
                </span>
            )
        },
        {
            id: 'isPublic',
            header: 'Trạng thái',
            cell: (category) => (
                <Switch
                    checked={category.isPublic}
                    onCheckedChange={() => handleToggleStatus(category.id)}
                />
            )
        },
        {
            id: 'actions',
            header: 'Thao tác',
            cell: (category) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    title="Chỉnh sửa"
                >
                    <LucideIcon name="Edit" iconSize={16} />
                </Button>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Tiêu đề và nút tạo mới */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
                    <p className="text-gray-600 mt-1">Danh sách các danh mục dịch vụ trong hệ thống</p>
                </div>
                <div>
                    <Button variant="default" onClick={handleCreate}>
                        <LucideIcon name="Plus" className="mr-1" /> Tạo mới danh mục
                    </Button>
                </div>
            </div>

            {/* Dialog tạo mới danh mục */}
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tạo mới danh mục</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">ID *</label>
                            <Input
                                value={formData.id}
                                onChange={e => setFormData(u => ({ ...u, id: e.target.value }))}
                                placeholder="Nhập ID danh mục"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Tên danh mục *</label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData(u => ({ ...u, name: e.target.value }))}
                                placeholder="Nhập tên danh mục"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Mô tả *</label>
                            <TextArea
                                value={formData.description}
                                onChange={e => setFormData(u => ({ ...u, description: e.target.value }))}
                                placeholder="Nhập mô tả danh mục"
                                rows={3}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="font-medium">Trạng thái công khai</label>
                            <Switch
                                checked={formData.isPublic}
                                onCheckedChange={checked => setFormData(u => ({ ...u, isPublic: checked }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenCreate(false)} disabled={isSubmitting}>
                            Đóng
                        </Button>
                        <Button variant="default" onClick={handleSubmitCreate} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <LucideIcon name="Loader2" className="mr-2 animate-spin" />
                                    Đang tạo...
                                </>
                            ) : (
                                'Tạo danh mục'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DataTable */}
            <DataTable<ICategory>
                columns={columns}
                data={localCategories}
                keyExtractor={(category) => category.id}
                pagination={{
                    currentPage: pagination.current,
                    totalPages: pagination.totalPage,
                    totalItems: pagination.totalItem,
                    onPageChange: () => { }, // Không cần xử lý pagination
                    itemsPerPage: pagination.pageSize,
                }}
                emptyState={
                    <div className="text-center py-8">
                        <LucideIcon name="FolderOpen" className="mx-auto mb-4 text-gray-400" iconSize={48} />
                        <p className="text-gray-500">Không có danh mục nào</p>
                    </div>
                }
            />
        </div>
    );
}

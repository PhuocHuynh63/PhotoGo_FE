import React, { useState } from 'react';
import Table from '../Table/Table';
import TableCaption from '@components/Atoms/TableCaption/TableCaption';
import TableHeader from '@components/Molecules/TableHeader/TableHeader';
import TableRow from '@components/Molecules/TableRow/TableRow';
import TableHead from '@components/Atoms/TableHeader/TableHeader';
import TableBody from '@components/Molecules/TableBody/TableBody';
import TableCell from '@components/Atoms/TableCell/TableCell';
import Pagination from '../Pagination/Pagination';
import LucideIcon from '@components/Atoms/LucideIcon';
import { cn } from '@helpers/CN';
import Checkbox from '@components/Atoms/Checkbox';
import Select from '@components/Atoms/Select';

export function DataTable<T extends { id: string | number } & ICOMPONENTS.SortableRecord>({
    data,
    columns,
    itemsPerPage = 10,
    caption,
    loading = false,
    onRowClick,
    selectableRows = false,
    onSelectionChange,
    height = 400,
    width = 1000,
}: ICOMPONENTS.DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(itemsPerPage);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = sortedData.slice(startIndex, endIndex);

    const handleSort = (key: string) => {
        if (sortConfig?.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
            });
        } else {
            setSortConfig({ key, direction: 'asc' });
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = currentData.map(item => item.id);
            setSelectedRows(new Set(allIds));
            onSelectionChange?.(allIds);
        } else {
            setSelectedRows(new Set());
            onSelectionChange?.([]);
        }
    };

    const handleSelectRow = (id: string | number, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedRows(newSelected);
        onSelectionChange?.(Array.from(newSelected));
    };

    const handlePageSizeChange = (value: string) => {
        const newSize = parseInt(value);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-4" style={{ width: `${width}px` }}>
            {/* Selected rows indicator */}
            {selectableRows && selectedRows.size > 0 && (
                <div className="bg-gray-100 px-4 py-2 rounded-md flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-bold">
                        Đã chọn {selectedRows.size} dòng
                    </span>
                    <button
                        onClick={() => handleSelectAll(false)}
                        className="text-sm text-black hover:text-gray-900 bg-gray-200 px-2 py-1 rounded-md"
                    >
                        Bỏ chọn tất cả
                    </button>
                </div>
            )}

            {/* Table container with fixed layout */}
            <div className="relative border rounded-md">
                {/* Outer container with fake scrollbar */}
                <div className="relative" > {/* 17px is default scrollbar width */}
                    {/* Table header */}
                    <Table className="w-full table-fixed border-separate border-spacing-0">
                        {caption && <TableCaption>{caption}</TableCaption>}
                        <TableHeader>
                            <TableRow>
                                {selectableRows && (
                                    <TableHead className="w-[50px] bg-white sticky top-0 z-10 border-b rounded-tl-md">
                                        <Checkbox
                                            label=""
                                            checked={currentData.length > 0 && currentData.every(item => selectedRows.has(item.id))}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                    </TableHead>
                                )}
                                {columns.map((column) => (
                                    <TableHead
                                        key={column.key}
                                        onClick={() => column.sortable && handleSort(column.key)}
                                        className={cn(
                                            "bg-white sticky top-0 z-10 border-b rounded-tr-md",
                                            "px-4 py-2",
                                            column.sortable ? 'cursor-pointer select-none' : '',
                                            sortConfig?.key === column.key ? 'bg-gray-200 font-medium' : ''
                                        )}
                                        style={{ width: column.width }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span className="truncate">{column.header}</span>
                                            {column.sortable && (
                                                <LucideIcon
                                                    name={
                                                        sortConfig?.key === column.key
                                                            ? sortConfig.direction === 'asc'
                                                                ? "ArrowUp"
                                                                : "ArrowDown"
                                                            : "ArrowUpDown"
                                                    }
                                                    className="flex-shrink-0"
                                                    iconSize={14}
                                                />
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                    </Table>

                    {/* Table body with custom scrollbar */}
                    <div
                        className="overflow-y-scroll"
                        style={{
                            maxHeight: `${height}px`,
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#CBD5E1 transparent'
                        }}
                    >
                        <Table className="w-full table-fixed border-separate">
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + (selectableRows ? 1 : 0)} className="text-center">
                                            Đang tải dữ liệu...
                                        </TableCell>
                                    </TableRow>
                                ) : currentData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + (selectableRows ? 1 : 0)} className="text-center">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentData.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            onClick={onRowClick ? () => onRowClick(item) : undefined}
                                            className={cn(
                                                onRowClick ? 'cursor-pointer' : '',
                                                'hover:bg-gray-50',
                                                selectedRows.has(item.id) && 'bg-gray-50'
                                            )}
                                        >
                                            {selectableRows && (
                                                <TableCell
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-[50px]"
                                                >
                                                    <Checkbox
                                                        label=""
                                                        checked={selectedRows.has(item.id)}
                                                        onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                                                    />
                                                </TableCell>
                                            )}
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={`${item.id}-${column.key}`}
                                                    className="px-5 py-2"
                                                    style={{ width: column.width }}
                                                >
                                                    <div className="truncate">
                                                        {column.render
                                                            ? column.render(item)
                                                            : item[column.key] instanceof Date
                                                                ? item[column.key].toLocaleString()
                                                                : String(item[column.key])
                                                        }
                                                    </div>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Pagination section */}
            <div className="flex flex-col gap-4 px-4 py-2 border rounded-md bg-gray-50">
                <div className="flex flex-col md:flex-row items-center justify-between">

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Select
                            options={["5", "10", "20", "50", "100"]}
                            value={pageSize.toString()}
                            onChange={(e) => handlePageSizeChange(e.target.value)}
                        />
                        <span>dòng mỗi trang</span>
                    </div>

                    <div>
                        {totalPages > 1 && !loading && (
                            <div className="flex justify-center w-full">
                                <Pagination
                                    total={totalPages}
                                    current={currentPage}
                                    onChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-gray-700">
                        <span>
                            {startIndex + 1}-{Math.min(endIndex, sortedData.length)} / {sortedData.length} bản ghi
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

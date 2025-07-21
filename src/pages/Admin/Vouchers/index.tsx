'use client';

import { IVoucherModel } from "@models/voucher/common.model";
import { IPagination } from "@models/metadata";
import { Button } from "@components/Atoms/Button/Button";
import Search from "@components/Molecules/Search/Search";
import LucideIcon from "@components/Atoms/LucideIcon";
import Select from "@components/Atoms/Select";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VoucherKanbanBoard from "./components/VoucherKanbanBoard";
import VoucherTable from "./components/VoucherTable";
import CreateVoucherFlow from "./components/CreateVoucherFlow";
import { VOUCHER } from "@constants/voucher";
import voucherService from "@services/voucher";

const STATUS_OPTIONS = [
  { value: 'Tất cả', icon: 'Circle', name: 'Tất cả' },
  ...Object.entries(VOUCHER.STATUS_MAP)?.map(([value, { name, icon }]) => ({ value, name, icon }))
];

const TYPE_OPTIONS = [
  { value: 'Tất cả', icon: 'Tag', name: 'Tất cả' },
  ...Object.entries(VOUCHER.TYPE_MAP)?.map(([value, { name, icon }]) => ({ value, name, icon }))
];

const DISCOUNT_TYPE_OPTIONS = [
  { value: 'Tất cả', icon: 'Percent', name: 'Tất cả' },
  ...Object.entries(VOUCHER.DISCOUNT_TYPE_MAP)?.map(([value, { name, icon }]) => ({ value, name, icon }))
];

const SORT_FIELDS = [
  { value: 'created_at', name: 'Ngày tạo' },
  { value: 'updated_at', name: 'Ngày cập nhật' },
];

const SORT_DIRECTIONS = [
  { value: 'asc', icon: 'ArrowUp', name: 'Tăng dần' },
  { value: 'desc', icon: 'ArrowDown', name: 'Giảm dần' },
];

interface AdminVouchersPageProps {
  vouchers: IVoucherModel[];
  pagination: IPagination;
}

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ viewMode }: { viewMode: 'kanban' | 'table' }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <LucideIcon name="Ticket" className="text-gray-400" iconSize={32} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có voucher nào</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      {viewMode === 'kanban'
        ? 'Bắt đầu tạo voucher đầu tiên để quản lý chương trình khuyến mãi của bạn'
        : 'Tạo voucher mới để bắt đầu quản lý chương trình khuyến mãi'
      }
    </p>
    <Button variant="default" className="shadow-lg hover:shadow-xl transition-shadow">
      <LucideIcon name="Plus" className="mr-2" />
      Tạo voucher đầu tiên
    </Button>
  </div>
);

export default function AdminVouchersPage({ vouchers: initialVouchers, pagination: initialPagination }: AdminVouchersPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchValue = searchParams?.get('q') || '';
  const statusValue = searchParams?.get('status') || '';
  const typeValue = searchParams?.get('type') || '';
  const discountTypeValue = searchParams?.get('discountType') || '';
  const sortFieldValue = searchParams?.get('sortBy') || '';
  const sortDirectionValue = searchParams?.get('sortDirection') || '';

  // State tạm cho filter/sort
  const [tempStatus, setTempStatus] = useState(statusValue);
  const [tempType, setTempType] = useState(typeValue);
  const [tempDiscountType, setTempDiscountType] = useState(discountTypeValue);
  const [tempSortField, setTempSortField] = useState(sortFieldValue);
  const [tempSortDirection, setTempSortDirection] = useState(sortDirectionValue);
  const [showFilters, setShowFilters] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [pageSize, setPageSize] = useState(viewMode === 'kanban' ? 50 : 10);

  // Đồng bộ state tạm với URL khi URL thay đổi
  useEffect(() => {
    setTempStatus(statusValue);
    setTempType(typeValue);
    setTempDiscountType(discountTypeValue);
    setTempSortField(sortFieldValue);
    setTempSortDirection(sortDirectionValue);
  }, [statusValue, typeValue, discountTypeValue, sortFieldValue, sortDirectionValue]);

  // Khi chuyển viewMode, cập nhật pageSize và reset về trang 1
  useEffect(() => {
    const newPageSize = viewMode === 'kanban' ? 50 : 10;
    setPageSize(newPageSize);
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('current', '1');
    params.set('pageSize', newPageSize.toString());
    router.push(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // Hàm cập nhật query string khi bấm Áp dụng
  const handleApply = () => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (tempStatus && tempStatus !== 'Tất cả') params.set('status', tempStatus); else params.delete('status');
    if (tempType && tempType !== 'Tất cả') params.set('type', tempType); else params.delete('type');
    if (tempDiscountType && tempDiscountType !== 'Tất cả') params.set('discountType', tempDiscountType); else params.delete('discountType');
    if (tempSortField) params.set('sortBy', tempSortField); else params.delete('sortBy');
    if (tempSortDirection) params.set('sortDirection', tempSortDirection); else params.delete('sortDirection');
    params.set('current', '1');
    params.set('pageSize', pageSize.toString());
    router.push(`?${params.toString()}`);
  };

  // Đặt lại bộ lọc
  const handleReset = () => {
    setTempStatus('');
    setTempType('');
    setTempDiscountType('');
    setTempSortField('');
    setTempSortDirection('');
    router.push('?current=1');
  };

  // Phân trang
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('current', page.toString());
    params.set('pageSize', pageSize.toString());
    router.push(`?${params.toString()}`);
  };

  // Search
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    params.set('current', '1');
    params.set('pageSize', pageSize.toString());
    router.push(`?${params.toString()}`);
  };

  const [vouchers, setVouchers] = useState(initialVouchers);
  const [pagination, setPagination] = useState(initialPagination);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Reset lại state khi filter/search/sort thay đổi 
  useEffect(() => {
    setVouchers(initialVouchers);
    setPagination(initialPagination);
  }, [initialVouchers, initialPagination]);

  // Infinite scroll: tự động load thêm khi chạm đáy
  const loadMore = useCallback(async () => {
    if (loadingMore || pagination?.current >= pagination?.totalPage) return;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      // Lấy lại các filter hiện tại từ searchParams nếu cần
      params.set("current", (pagination?.current + 1).toString());
      params.set("pageSize", pageSize.toString());
      if (searchValue) params.set("q", searchValue);
      if (statusValue) params.set("status", statusValue);
      if (typeValue) params.set("type", typeValue);
      if (discountTypeValue) params.set("discountType", discountTypeValue);
      if (sortFieldValue) params.set("sortBy", sortFieldValue);
      if (sortDirectionValue) params.set("sortDirection", sortDirectionValue);
      const res = await voucherService.getAdminVouchers(params);
      let newVouchers: IVoucherModel[] = [];
      let newPagination: any = {};
      if (
        res && typeof res === 'object' &&
        'data' in res && res.data && typeof res.data === 'object' &&
        'data' in res.data && (res.data as any).data && typeof (res.data as any).data === 'object'
      ) {
        const dataObj = (res.data as any).data;
        newVouchers = Array.isArray(dataObj.data) ? dataObj.data : [];
        newPagination = dataObj.pagination || {};
      }
      setVouchers(prev => [...prev, ...newVouchers]);
      setPagination(prev => ({
        ...prev,
        current: prev?.current + 1,
        totalItem: newPagination.totalItem || prev.totalItem,
        totalPage: newPagination?.totalPage || prev?.totalPage
      }));
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pagination, searchValue, statusValue, typeValue, discountTypeValue, sortFieldValue, sortDirectionValue, pageSize]);

  useEffect(() => {
    if (!loaderRef?.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination?.current < pagination?.totalPage && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef?.current);
    return () => observer.disconnect();
  }, [loaderRef, pagination, loadingMore, loadMore]);

  // Kiểm tra có filter nào đang active không
  const hasActiveFilters = statusValue || typeValue || discountTypeValue || sortFieldValue || sortDirectionValue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <LucideIcon name="Ticket" className="text-blue-600" iconSize={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Quản lý voucher</h1>
                  <p className="text-gray-600">Quản lý danh sách voucher trong hệ thống</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="default"
                onClick={() => setOpenCreate(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <LucideIcon name="Plus" className="mr-2" />
                Thêm voucher
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <LucideIcon name="Download" className="mr-2" />
                Download Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 items-center">
              <div className="flex-1 min-w-0">
                <Search
                  placeholder="Tìm kiếm voucher theo mã, mô tả..."
                  value={searchValue}
                  onChange={handleSearch}
                  searchWidth="100%"
                  className="w-full h-11"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 h-11">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 h-full ${viewMode === 'kanban'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                >
                  <LucideIcon name="LayoutGrid" iconSize={16} />
                  <span className="hidden sm:inline">Kanban</span>
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 h-full ${viewMode === 'table'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                >
                  <LucideIcon name="Table" iconSize={16} />
                  <span className="hidden sm:inline">Bảng</span>
                </Button>
              </div>
            </div>

            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border-2 transition-all duration-200 h-11 ${showFilters
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
            >
              <LucideIcon name="Filter" iconSize={16} />
              <span className="hidden sm:inline">Bộ lọc</span>
              {hasActiveFilters && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
              {showFilters ?
                <LucideIcon name="ChevronUp" iconSize={16} /> :
                <LucideIcon name="ChevronDown" iconSize={16} />
              }
            </Button>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
                {statusValue && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Trạng thái: {STATUS_OPTIONS.find(opt => opt.value === statusValue)?.name}
                    <button
                      onClick={() => {
                        setTempStatus('');
                        handleApply();
                      }}
                      className="ml-1 hover:text-blue-900"
                    >
                      <LucideIcon name="X" iconSize={12} />
                    </button>
                  </span>
                )}
                {typeValue && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Loại: {TYPE_OPTIONS.find(opt => opt.value === typeValue)?.name}
                    <button
                      onClick={() => {
                        setTempType('');
                        handleApply();
                      }}
                      className="ml-1 hover:text-green-900"
                    >
                      <LucideIcon name="X" iconSize={12} />
                    </button>
                  </span>
                )}
                {discountTypeValue && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Giảm giá: {DISCOUNT_TYPE_OPTIONS.find(opt => opt.value === discountTypeValue)?.name}
                    <button
                      onClick={() => {
                        setTempDiscountType('');
                        handleApply();
                      }}
                      className="ml-1 hover:text-purple-900"
                    >
                      <LucideIcon name="X" iconSize={12} />
                    </button>
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Xóa tất cả
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-6">
              {/* Filter Section */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <LucideIcon name="Filter" className="text-blue-600" iconSize={16} />
                  Bộ lọc
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Select
                    placeHolder="Trạng thái"
                    height="h-11"
                    selectIcon="Circle"
                    value={tempStatus}
                    onValueChange={setTempStatus}
                    options={STATUS_OPTIONS}
                    className="border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                  />
                  <Select
                    placeHolder="Loại voucher"
                    height="h-11"
                    selectIcon="Tag"
                    value={tempType}
                    onValueChange={setTempType}
                    options={TYPE_OPTIONS}
                    className="border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                  />
                  <Select
                    placeHolder="Loại giảm giá"
                    height="h-11"
                    selectIcon="Percent"
                    value={tempDiscountType}
                    onValueChange={setTempDiscountType}
                    options={DISCOUNT_TYPE_OPTIONS}
                    className="border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

              {/* Sort Section */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <LucideIcon name="ArrowUpDown" className="text-blue-600" iconSize={16} />
                  Sắp xếp
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    placeHolder="Sắp xếp theo"
                    height="h-11"
                    selectIcon="ArrowUpDown"
                    value={tempSortField}
                    onValueChange={setTempSortField}
                    options={SORT_FIELDS}
                    className="border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                  />
                  <Select
                    placeHolder="Tăng/Giảm dần"
                    height="h-11"
                    selectIcon={tempSortDirection === 'asc' ? 'ArrowUp' : tempSortDirection === 'desc' ? 'ArrowDown' : undefined}
                    value={tempSortDirection}
                    onValueChange={setTempSortDirection}
                    options={SORT_DIRECTIONS}
                    className="border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                    disabled={!tempSortField}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 items-center justify-end pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleReset}
                className="px-6 py-2 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Đặt lại
              </Button>
              <Button
                variant="default"
                onClick={handleApply}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Áp dụng
              </Button>
            </div>
          </div>
        )}

        {/* Create Voucher Dialog */}
        <CreateVoucherFlow
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
            router.refresh();
          }}
        />

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {(!vouchers || vouchers.length === 0) && !loadingMore ? (
            <EmptyState viewMode={viewMode} />
          ) : viewMode === 'kanban' ? (
            <>
              <VoucherKanbanBoard
                vouchers={vouchers || []}
                onVoucherUpdate={() => router.refresh()}
              />
              {/* Enhanced Loader for infinite scroll */}
              <div ref={loaderRef} className="p-6 border-t border-gray-100">
                {loadingMore ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Đang tải thêm voucher...</span>
                  </div>
                ) : pagination?.current < pagination?.totalPage ? (
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                      <LucideIcon name="ArrowDown" className="text-gray-400" iconSize={16} />
                    </div>
                    <span className="text-gray-500 text-sm">Kéo xuống để tải thêm voucher</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                      <LucideIcon name="Check" className="text-green-600" iconSize={16} />
                    </div>
                    <span className="text-gray-500 text-sm">Đã tải hết voucher</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <VoucherTable
              vouchers={vouchers || []}
              pagination={pagination}
              onPageChange={handlePageChange}
              onVoucherUpdate={() => router.refresh()}
            />
          )}
        </div>
      </div>
    </div>
  );
} 
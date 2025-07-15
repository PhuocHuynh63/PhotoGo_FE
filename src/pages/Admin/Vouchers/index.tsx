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
  ...Object.entries(VOUCHER.STATUS_MAP).map(([value, { name, icon }]) => ({ value, name, icon }))
];

const TYPE_OPTIONS = [
  { value: 'Tất cả', icon: 'Tag', name: 'Tất cả' },
  ...Object.entries(VOUCHER.TYPE_MAP).map(([value, { name, icon }]) => ({ value, name, icon }))
];

const DISCOUNT_TYPE_OPTIONS = [
  { value: 'Tất cả', icon: 'Percent', name: 'Tất cả' },
  ...Object.entries(VOUCHER.DISCOUNT_TYPE_MAP).map(([value, { name, icon }]) => ({ value, name, icon }))
];

const SORT_FIELDS = [
  { value: 'code', name: 'Mã voucher' },
  { value: 'discount_value', name: 'Giá trị giảm' },
  { value: 'quantity', name: 'Số lượng' },
  { value: 'start_date', name: 'Ngày bắt đầu' },
  { value: 'end_date', name: 'Ngày kết thúc' },
  { value: 'created_at', name: 'Ngày tạo' },
];

const SORT_DIRECTIONS = [
  { value: 'asc', icon: 'ArrowUp', name: 'Tăng dần' },
  { value: 'desc', icon: 'ArrowDown', name: 'Giảm dần' },
];

interface AdminVouchersPageProps {
  vouchers: IVoucherModel[];
  pagination: IPagination;
}

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
    if (loadingMore || pagination.current >= pagination.totalPage) return;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      // Lấy lại các filter hiện tại từ searchParams nếu cần
      params.set("current", (pagination.current + 1).toString());
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
        current: prev.current + 1,
        totalItem: newPagination.totalItem || prev.totalItem,
        totalPage: newPagination.totalPage || prev.totalPage
      }));
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pagination, searchValue, statusValue, typeValue, discountTypeValue, sortFieldValue, sortDirectionValue, pageSize]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.current < pagination.totalPage && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, pagination, loadingMore, loadMore]);

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề và nút thao tác */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý voucher</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách voucher trong hệ thống</p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" onClick={() => setOpenCreate(true)}>
            <LucideIcon name="Plus" className="mr-1" /> Thêm voucher
          </Button>
          <Button variant="outline">
            <LucideIcon name="Download" className="mr-1" /> Download Excel
          </Button>
        </div>
      </div>

      {/* Search và nút Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <Search
            placeholder="Tìm kiếm voucher..."
            value={searchValue}
            onChange={handleSearch}
            searchWidth="100%"
            className="flex-1 min-w-[250px] max-w-2xl"
          />
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              onClick={() => setViewMode('kanban')}
              className="flex items-center gap-2"
            >
              <LucideIcon name="LayoutGrid" iconSize={16} />
              Kanban
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
            >
              <LucideIcon name="Table" iconSize={16} />
              Bảng
            </Button>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 min-w-[120px]"
        >
          <LucideIcon name="Filter" iconSize={16} />
          Bộ lọc
          {showFilters ? <LucideIcon name="ChevronUp" iconSize={16} /> : <LucideIcon name="ChevronDown" iconSize={16} />}
        </Button>
      </div>

      {/* Filter và Sort (ẩn/hiện) */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow space-y-4">
          <div className="space-y-4">
            {/* Filter Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Bộ lọc</h3>
              <div className="flex flex-wrap gap-4">
                <Select
                  placeHolder="Trạng thái"
                  height="h-10"
                  selectIcon="Circle"
                  value={tempStatus}
                  onValueChange={setTempStatus}
                  options={STATUS_OPTIONS}
                  className="min-w-[160px] max-w-xs flex-1 border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                />
                <Select
                  placeHolder="Loại voucher"
                  height="h-10"
                  selectIcon="Tag"
                  value={tempType}
                  onValueChange={setTempType}
                  options={TYPE_OPTIONS}
                  className="min-w-[160px] max-w-xs flex-1 border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                />
                <Select
                  placeHolder="Loại giảm giá"
                  height="h-10"
                  selectIcon="Percent"
                  value={tempDiscountType}
                  onValueChange={setTempDiscountType}
                  options={DISCOUNT_TYPE_OPTIONS}
                  className="min-w-[160px] max-w-xs flex-1 border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200"></div>

            {/* Sort Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Sắp xếp</h3>
              <div className="flex flex-wrap gap-4">
                <Select
                  placeHolder="Sắp xếp theo"
                  height="h-10"
                  selectIcon="ArrowUpDown"
                  value={tempSortField}
                  onValueChange={setTempSortField}
                  options={SORT_FIELDS}
                  className="min-w-[160px] max-w-xs flex-1 border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                />
                <Select
                  placeHolder="Tăng/Giảm dần"
                  height="h-10"
                  selectIcon={tempSortDirection === 'asc' ? 'ArrowUp' : tempSortDirection === 'desc' ? 'ArrowDown' : undefined}
                  value={tempSortDirection}
                  onValueChange={setTempSortDirection}
                  options={SORT_DIRECTIONS}
                  className="min-w-[120px] max-w-xs flex-1 border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                  disabled={!tempSortField}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-center justify-end pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-200 border border-gray-300"
              onClick={handleReset}
            >
              Đặt lại
            </Button>
            <Button
              variant="default"
              className="bg-blue-500 text-white font-bold rounded-lg px-4 py-2 hover:bg-blue-600 shadow"
              onClick={handleApply}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      )}

      <CreateVoucherFlow
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => {
          setOpenCreate(false);
          router.refresh();
        }}
      />

      {/* Content */}
      {viewMode === 'kanban' ? (
        <>
          <VoucherKanbanBoard
            vouchers={vouchers}
            onVoucherUpdate={() => router.refresh()}
          />
          {/* Loader cho infinite scroll */}
          <div ref={loaderRef} className="flex justify-center py-4">
            {loadingMore && <span>Đang tải thêm...</span>}
            {!loadingMore && pagination.current < pagination.totalPage && <span className="text-gray-400">Kéo xuống để tải thêm...</span>}
            {pagination.current >= pagination.totalPage && <span className="text-gray-400">Đã tải hết voucher</span>}
          </div>
        </>
      ) : (
        <VoucherTable
          vouchers={vouchers}
          pagination={pagination}
          onPageChange={handlePageChange}
          onVoucherUpdate={() => router.refresh()}
        />
      )}
    </div>
  );
} 
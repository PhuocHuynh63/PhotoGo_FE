'use client';

import { ICampaign } from '@models/campaign/common.model';
import { IPagination } from '@models/metadata';
import { Button } from '@components/Atoms/Button/Button';
import Search from '@components/Molecules/Search/Search';
import LucideIcon from '@components/Atoms/LucideIcon';
import Select from '@components/Atoms/Select';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CampaignKanbanBoard from './Components/CampaignKanbanBoard';
import DatePicker from '@components/Atoms/DatePicker';
import AddCampaignDialog from './Components/AddCampaignDialog';
import { campaignService } from '@services/campaign';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'all', icon: 'Circle', name: 'Tất cả trạng thái' },
  { value: 'Đang chạy', icon: 'CheckCircle', name: 'Hoạt động' },
  { value: 'Không hoạt động', icon: 'PauseCircle', name: 'Không hoạt động' },
];

const SORT_FIELDS = [
  { value: 'created_at', name: 'Ngày tạo' },
  { value: 'name', name: 'Tên chiến dịch' },
  { value: 'startDate', name: 'Ngày bắt đầu' },
  { value: 'endDate', name: 'Ngày kết thúc' },
];

const SORT_DIRECTIONS = [
  { value: 'asc', icon: 'ArrowUp', name: 'Tăng dần' },
  { value: 'desc', icon: 'ArrowDown', name: 'Giảm dần' },
];

interface AdminCampaignsPageProps {
  campaigns: ICampaign[];
  pagination: IPagination;
}

export default function AdminCampaignsPage({ campaigns: initialCampaigns, pagination: initialPagination }: AdminCampaignsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Luôn tự động thêm showAll=true vào URL nếu thiếu
  useEffect(() => {
    if (typeof window !== 'undefined' && !searchParams?.get('showAll')) {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      params.set('showAll', 'true');
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router]);

  const searchValue = searchParams?.get('name') || '';
  const statusValue = searchParams?.get('status') || 'all';
  const sortFieldValue = searchParams?.get('sortBy') || '';
  const sortDirectionValue = searchParams?.get('sortDirection') || '';
  const startDateValue = searchParams?.get('startDate') || '';
  const endDateValue = searchParams?.get('endDate') || '';

  // State tạm cho filter/sort
  const [tempStatus, setTempStatus] = useState(statusValue);
  const [tempSortField, setTempSortField] = useState(sortFieldValue);
  const [tempSortDirection, setTempSortDirection] = useState(sortDirectionValue);
  const [tempStartDate, setTempStartDate] = useState(startDateValue);
  const [tempEndDate, setTempEndDate] = useState(endDateValue);
  const [showFilters, setShowFilters] = useState(false);
  const [pageSize] = useState(10);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Đồng bộ state tạm với URL khi URL thay đổi
  useEffect(() => {
    setTempStatus(statusValue);
    setTempSortField(sortFieldValue);
    setTempSortDirection(sortDirectionValue);
    setTempStartDate(startDateValue);
    setTempEndDate(endDateValue);
  }, [statusValue, sortFieldValue, sortDirectionValue, startDateValue, endDateValue]);

  // Hàm cập nhật query string khi bấm Áp dụng
  const handleApply = () => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (tempStatus === 'true') params.set('status', 'true');
    else if (tempStatus === 'false') params.set('status', 'false');
    else params.delete('status'); // Tất cả trạng thái
    if (tempSortField) params.set('sortBy', tempSortField); else params.delete('sortBy');
    if (tempSortDirection) params.set('sortDirection', tempSortDirection); else params.delete('sortDirection');
    if (tempStartDate) params.set('startDate', tempStartDate); else params.delete('startDate');
    if (tempEndDate) params.set('endDate', tempEndDate); else params.delete('endDate');
    if (searchValue) params.set('name', searchValue); else params.delete('name');
    params.set('current', '1');
    params.set('pageSize', pageSize.toString());
    params.set('showAll', 'true');
    router.push(`?${params.toString()}`);
  };

  // Đặt lại bộ lọc
  const handleReset = () => {
    setTempStatus('all');
    setTempSortField('');
    setTempSortDirection('');
    setTempStartDate('');
    setTempEndDate('');
    // Xóa param name khi reset
    const params = new URLSearchParams();
    params.set('current', '1');
    params.set('showAll', 'true');
    router.push(`?${params.toString()}`);
  };

  // Phân trang
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('current', page.toString());
    params.set('pageSize', pageSize.toString());
    params.set('showAll', 'true'); // luôn luôn true
    router.push(`?${params.toString()}`);
  };

  // Search
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (value) {
      params.set('name', value);
    } else {
      params.delete('name');
    }
    params.set('current', '1');
    params.set('pageSize', pageSize.toString());
    params.set('showAll', 'true'); // luôn luôn true
    router.push(`?${params.toString()}`);
  };

  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [pagination, setPagination] = useState(initialPagination);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Reset lại state khi filter/search/sort thay đổi 
  useEffect(() => {
    setCampaigns(initialCampaigns);
    setPagination(initialPagination);
  }, [initialCampaigns, initialPagination]);
  
  // Hàm để fetch campaigns mới nhất
  const fetchLatestCampaigns = async () => {
    try {
      const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
      params.set('showAll', 'true');
      const response = await campaignService.getCampaigns(params);
      
      // Xử lý response theo cấu trúc của API
      const responseData = response as any;
      if (responseData?.data?.items) {
        setCampaigns(responseData.data.items);
      }
      if (responseData?.data?.pagination) {
        setPagination(responseData.data.pagination);
      }
      toast.success('Cập nhật danh sách chiến dịch thành công');
    } catch (error) {
      console.error('Error fetching latest campaigns:', error);
      toast.error('Không thể cập nhật danh sách chiến dịch');
    }
  };

  // Infinite scroll: tự động load thêm khi chạm đáy
  const loadMore = useCallback(async () => {
    if (loadingMore || pagination?.current >= pagination?.totalPage) return;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      params.set('current', (pagination?.current + 1).toString());
      params.set('pageSize', pageSize.toString());
      if (searchValue) params.set('name', searchValue);
      if (statusValue) params.set('status', statusValue);
      if (sortFieldValue) params.set('sortBy', sortFieldValue);
      if (sortDirectionValue) params.set('sortDirection', sortDirectionValue);
      if (startDateValue) params.set('startDate', startDateValue);
      if (endDateValue) params.set('endDate', endDateValue);
      // Gọi API lấy thêm campaign ở đây nếu muốn (cần truyền hàm fetch từ service)
      // const res = await campaignService.getCampaigns(params);
      // ...
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pagination, searchValue, statusValue, sortFieldValue, sortDirectionValue, pageSize, startDateValue, endDateValue]);

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

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề và nút thao tác */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chiến dịch</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách chiến dịch marketing trong hệ thống</p>
        </div>
        <Button onClick={() => setOpenAddDialog(true)} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700">
          <LucideIcon name="Plus" className="mr-2" />
          Tạo campaign
        </Button>
      </div>

      {/* Search và nút Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <Search
            placeholder="Tìm kiếm tên chiến dịch..."
            value={searchValue}
            onChange={handleSearch}
            searchWidth="100%"
            className="flex-1 min-w-[250px] max-w-2xl"
          />
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
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow space-y-6">
          {/* Bộ lọc */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Bộ lọc</h3>
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="min-w-[200px]">
                <Select
                  placeHolder="Trạng thái"
                  height="h-10"
                  selectIcon="Circle"
                  value={tempStatus}
                  onValueChange={setTempStatus}
                  options={STATUS_OPTIONS}
                  className="w-full border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                />
              </div>
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                <DatePicker
                  value={tempStartDate ? new Date(tempStartDate) : null}
                  onChange={date => setTempStartDate(date ? date.toISOString().split('T')[0] : '')}
                  placeholder="Chọn ngày bắt đầu"
                />
              </div>
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                <DatePicker
                  value={tempEndDate ? new Date(tempEndDate) : null}
                  onChange={date => setTempEndDate(date ? date.toISOString().split('T')[0] : '')}
                  placeholder="Chọn ngày kết thúc"
                />
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="w-full h-px bg-gray-200"></div>
          {/* Sắp xếp */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Sắp xếp</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="min-w-[220px]">
                <Select
                  placeHolder="Sắp xếp theo trường"
                  height="h-10"
                  selectIcon="ArrowUpDown"
                  value={tempSortField}
                  onValueChange={setTempSortField}
                  options={SORT_FIELDS}
                  className="w-full border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                />
              </div>
              <div className="min-w-[180px]">
                <Select
                  placeHolder="Tăng/Giảm dần"
                  height="h-10"
                  selectIcon={tempSortDirection === 'asc' ? 'ArrowUp' : tempSortDirection === 'desc' ? 'ArrowDown' : undefined}
                  value={tempSortDirection}
                  onValueChange={setTempSortDirection}
                  options={SORT_DIRECTIONS}
                  className="w-full border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
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
              className="bg-orange-400 text-white font-bold rounded-lg px-4 py-2 hover:bg-orange-500 shadow"
              onClick={handleApply}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <CampaignKanbanBoard campaigns={campaigns} />

      {/* Loader cho infinite scroll */}
      <div ref={loaderRef} className="flex justify-center py-4">
        {loadingMore && <span>Đang tải thêm...</span>}
        {!loadingMore && pagination?.current < pagination?.totalPage && <span className="text-gray-400">Kéo xuống để tải thêm...</span>}
        {pagination?.current >= pagination?.totalPage && <span className="text-gray-400">Đã tải hết chiến dịch</span>}
      </div>
      {/* Dialog tạo campaign */}
      <AddCampaignDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={async () => {
          setOpenAddDialog(false);
          // Cập nhật danh sách campaigns sau khi thêm mới
          await fetchLatestCampaigns();
        }}
      />
    </div>
  );
} 
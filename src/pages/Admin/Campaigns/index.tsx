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

export default function AdminCampaignsPage({ campaigns: initialCampaigns = [], pagination: initialPagination }: AdminCampaignsPageProps) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <LucideIcon name="Target" iconSize={16} />
              Campaigns
            </span>
            <LucideIcon name="ChevronRight" iconSize={14} />
            <span className="text-gray-900 font-medium">Quản lý chiến dịch</span>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <LucideIcon name="Target" className="text-blue-600" iconSize={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý chiến dịch</h1>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <LucideIcon name="BarChart3" iconSize={14} />
                    <span className="text-sm">Tổng cộng: {pagination?.totalItem || 0} chiến dịch</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center gap-1">
                    <LucideIcon name="CheckCircle" iconSize={14} />
                    <span className="text-sm">{campaigns.filter(c => c.status === 'active').length} đang hoạt động</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 border-gray-300 hover:bg-gray-50"
              >
                <LucideIcon name="Download" iconSize={16} />
                Xuất báo cáo
              </Button>
              <Button
                onClick={() => setOpenAddDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <LucideIcon name="Plus" iconSize={16} />
                Tạo campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search và Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex gap-3 flex-1">
              <div className="flex-1 min-w-[250px] max-w-2xl">
                <Search
                  placeholder="Tìm kiếm tên chiến dịch..."
                  value={searchValue}
                  onChange={handleSearch}
                  searchWidth="100%"
                  className="w-full"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 min-w-[120px] border-gray-300 hover:bg-gray-50"
            >
              <LucideIcon name="Filter" iconSize={16} />
              Bộ lọc
              {showFilters ? <LucideIcon name="ChevronUp" iconSize={16} /> : <LucideIcon name="ChevronDown" iconSize={16} />}
            </Button>
          </div>

          {/* Filter và Sort (ẩn/hiện) */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
              {/* Bộ lọc */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <LucideIcon name="Filter" iconSize={16} />
                  Bộ lọc
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <Select
                      placeHolder="Chọn trạng thái"
                      height="h-10"
                      selectIcon="Circle"
                      value={tempStatus}
                      onValueChange={setTempStatus}
                      options={STATUS_OPTIONS}
                      className="w-full border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                    <DatePicker
                      value={tempStartDate ? new Date(tempStartDate) : null}
                      onChange={date => setTempStartDate(date ? date.toISOString().split('T')[0] : '')}
                      placeholder="Chọn ngày bắt đầu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                    <DatePicker
                      value={tempEndDate ? new Date(tempEndDate) : null}
                      onChange={date => setTempEndDate(date ? date.toISOString().split('T')[0] : '')}
                      placeholder="Chọn ngày kết thúc"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                        onClick={handleReset}
                      >
                        <LucideIcon name="RotateCcw" iconSize={14} />
                        Đặt lại
                      </Button>
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={handleApply}
                      >
                        <LucideIcon name="Check" iconSize={14} />
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sắp xếp */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <LucideIcon name="ArrowUpDown" iconSize={16} />
                  Sắp xếp
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
                    <Select
                      placeHolder="Chọn trường sắp xếp"
                      height="h-10"
                      selectIcon="ArrowUpDown"
                      value={tempSortField}
                      onValueChange={setTempSortField}
                      options={SORT_FIELDS}
                      className="w-full border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
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
            </div>
          )}
        </div>

        {/* Kanban Board */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <CampaignKanbanBoard campaigns={campaigns} />
        </div>

        {/* Loader cho infinite scroll */}
        <div ref={loaderRef} className="flex justify-center py-6">
          {loadingMore ? (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span>Đang tải thêm chiến dịch...</span>
            </div>
          ) : pagination?.current < pagination?.totalPage ? (
            <div className="flex items-center gap-2 text-gray-500">
              <LucideIcon name="ArrowDown" iconSize={16} />
              <span>Kéo xuống để tải thêm chiến dịch</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <LucideIcon name="CheckCircle" iconSize={16} />
              <span>Đã tải hết chiến dịch</span>
            </div>
          )}
        </div>
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
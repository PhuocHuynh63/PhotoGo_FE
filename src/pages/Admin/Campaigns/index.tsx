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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
    setTimeout(() => setIsLoading(false), 500);
  };

  // Đặt lại bộ lọc
  const handleReset = () => {
    setIsLoading(true);
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
    setTimeout(() => setIsLoading(false), 500);
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

  // Tính toán stats cho header
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalCampaigns = pagination?.totalItem || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section với gradient */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          <div className="relative px-6 py-6">
            {/* Main Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 shadow-sm">
                  <LucideIcon name="Target" className="text-white" iconSize={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white mb-1 tracking-tight">Quản lý chiến dịch</h1>
                  <div className="flex flex-wrap items-center gap-2 text-blue-100">
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                      <LucideIcon name="BarChart3" iconSize={10} />
                      <span className="text-xs font-medium">{totalCampaigns} chiến dịch</span>
                    </div>
                    <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded-full">
                      <LucideIcon name="CheckCircle" iconSize={10} />
                      <span className="text-xs font-medium">{activeCampaigns} đang hoạt động</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-sm font-medium"
                >
                  <LucideIcon name="Download" iconSize={14} />
                  Xuất báo cáo
                </Button>
                <Button
                  onClick={() => setOpenAddDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm"
                >
                  <LucideIcon name="Plus" iconSize={14} />
                  Tạo campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search và Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex gap-3 flex-1">
              <div className="flex-1 min-w-[250px] max-w-2xl">
                <Search
                  placeholder="🔍 Tìm kiếm tên chiến dịch..."
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
              className={`flex items-center gap-2 min-w-[140px] border-gray-200 hover:bg-gray-50 transition-all duration-200 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : ''
                }`}
            >
              <LucideIcon name="Filter" iconSize={16} />
              Bộ lọc
              {showFilters ? <LucideIcon name="ChevronUp" iconSize={16} /> : <LucideIcon name="ChevronDown" iconSize={16} />}
            </Button>
          </div>

          {/* Filter và Sort với animation */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mt-6 pt-6 border-t border-gray-200' : 'max-h-0 opacity-0'
            }`}>
            <div className="space-y-6">
              {/* Bộ lọc */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <LucideIcon name="Filter" iconSize={16} />
                  Bộ lọc nâng cao
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <Select
                      placeHolder="Chọn trạng thái"
                      height="h-11"
                      selectIcon="Circle"
                      value={tempStatus}
                      onValueChange={setTempStatus}
                      options={STATUS_OPTIONS}
                      className="w-full border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                    <DatePicker
                      value={tempStartDate ? new Date(tempStartDate) : null}
                      onChange={date => setTempStartDate(date ? date.toISOString().split('T')[0] : '')}
                      placeholder="Chọn ngày bắt đầu"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                    <DatePicker
                      value={tempEndDate ? new Date(tempEndDate) : null}
                      onChange={date => setTempEndDate(date ? date.toISOString().split('T')[0] : '')}
                      placeholder="Chọn ngày kết thúc"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex gap-3 w-full">
                      <Button
                        variant="outline"
                        className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 hover:scale-105"
                        onClick={handleReset}
                        disabled={isLoading}
                      >
                        <LucideIcon name="RotateCcw" iconSize={14} />
                        Đặt lại
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                        onClick={handleApply}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Đang áp dụng...</span>
                          </div>
                        ) : (
                          <>
                            <LucideIcon name="Check" iconSize={14} />
                            Áp dụng
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sắp xếp */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <LucideIcon name="ArrowUpDown" iconSize={16} />
                  Sắp xếp
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Sắp xếp theo</label>
                    <Select
                      placeHolder="Chọn trường sắp xếp"
                      height="h-11"
                      selectIcon="ArrowUpDown"
                      value={tempSortField}
                      onValueChange={setTempSortField}
                      options={SORT_FIELDS}
                      className="w-full border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Thứ tự</label>
                    <Select
                      placeHolder="Tăng/Giảm dần"
                      height="h-11"
                      selectIcon={tempSortDirection === 'asc' ? 'ArrowUp' : tempSortDirection === 'desc' ? 'ArrowDown' : undefined}
                      value={tempSortDirection}
                      onValueChange={setTempSortDirection}
                      options={SORT_DIRECTIONS}
                      className="w-full border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                      disabled={!tempSortField}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board với loading state */}
        <div className="bg-transparent">
          {isLoading ? (
            <div className="p-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
                </div>
              </div>
            </div>
          ) : (
            <CampaignKanbanBoard campaigns={campaigns} />
          )}
        </div>

        {/* Loader cho infinite scroll với cải thiện */}
        <div ref={loaderRef} className="flex justify-center py-6">
          {loadingMore ? (
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 text-sm">Đang tải thêm chiến dịch...</span>
            </div>
          ) : pagination?.current < pagination?.totalPage ? (
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 text-gray-500">
              <LucideIcon name="ArrowDown" iconSize={16} />
              <span className="text-sm">Kéo xuống để tải thêm chiến dịch</span>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="flex items-center gap-2 bg-green-50 px-4 py-3 rounded-lg border border-green-200 text-green-600">
              <LucideIcon name="CheckCircle" iconSize={16} />
              <span className="text-sm">Đã tải hết chiến dịch</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 bg-gray-50 px-6 py-8 rounded-lg border border-gray-200">
              <div className="p-3 bg-gray-100 rounded-full">
                <LucideIcon name="Target" className="text-gray-400" iconSize={24} />
              </div>
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-700 mb-1">Không có chiến dịch nào</h3>
                <p className="text-gray-500 mb-3 text-sm">Bắt đầu tạo chiến dịch đầu tiên của bạn</p>
                <Button
                  onClick={() => setOpenAddDialog(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  <LucideIcon name="Plus" iconSize={14} />
                  Tạo chiến dịch mới
                </Button>
              </div>
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
    </div >
  );
} 
"use client";
import { IVendorListItem } from "@models/vendor/common.model";
import { IPagination } from "@models/metadata";
import { DataTable, Column } from "@components/Organisms/Table/data-table";
import { Badge } from "@components/Atoms/Badge";
import Button from "@components/Atoms/Button";
import LucideIcon from "@components/Atoms/LucideIcon";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Select from "@components/Atoms/Select";
import Input from "@components/Atoms/Input";
import { RangeSlider } from "@components/Atoms/Slider/range-slider";
import AddVendorDialog from "@pages/Admin/Vendors/Components/AddVendorDialog";

interface AdminVendorsPageProps {
  vendors: IVendorListItem[];
  pagination: IPagination;
}

function ContactInfo({ email, phone }: { email: string; phone: string }) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-gray-900 truncate">{email}</span>
      <span className="text-xs text-gray-500">{phone}</span>
    </div>
  );
}


function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN");
}

function VendorAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <AvatarPrimitive.Root className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center ring-2 ring-white shadow-sm">
      <AvatarPrimitive.Image src={src} alt={alt} className="w-full h-full object-cover" />
      <AvatarPrimitive.Fallback className="text-gray-600 font-semibold text-lg bg-gradient-to-br from-blue-100 to-purple-100">
        {alt?.[0]?.toUpperCase() || "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

const STATUS_OPTIONS = [
  { value: 'all', name: 'Tất cả' },
  { value: 'hoạt động', name: 'Hoạt động' },
  { value: 'không hoạt động', name: 'Không hoạt động' },
  { value: 'tạm ngưng', name: 'Tạm ngưng' },
];
const SORT_FIELDS = [
  { value: 'all', name: 'Mặc định' },
  { value: 'name', name: 'Tên' },
  { value: 'createdAt', name: 'Ngày tham gia' },
  { value: 'priority', name: 'Độ ưu tiên' },
  { value: 'order_count', name: 'Số order' },
  { value: 'package_count', name: 'Số package' },
  { value: 'branch_count', name: 'Số chi nhánh' },
];
const SORT_DIRECTIONS = [
  { value: 'asc', name: 'Tăng dần' },
  { value: 'desc', name: 'Giảm dần' },
];

function statusBox(status: string) {
  switch (status?.trim().toLowerCase()) {
    case 'hoạt động':
      return (
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Hoạt động
        </span>
      );
    case 'không hoạt động':
      return (
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm">
          <LucideIcon name="PauseCircle" className="text-white" iconSize={12} />
          Không hoạt động
        </span>
      );
    case 'tạm ngưng':
      return (
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm">
          <LucideIcon name="Pause" className="text-white" iconSize={12} />
          Tạm ngưng
        </span>
      );
    default:
      return <span className="inline-flex items-center gap-1 bg-white text-gray-500 border border-gray-300 rounded-full px-3 py-1.5 text-xs">--</span>;
  }
}

const CATEGORY_OPTIONS = [
  { value: 'all', name: 'Tất cả danh mục' },
  { value: 'C001', name: 'Studio' },
  { value: 'C002', name: 'Makeup' },
  { value: 'C003', name: 'Trang phục' },
];

export default function AdminVendorsPage({ vendors, pagination }: AdminVendorsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function để lấy giá trị từ searchParams an toàn
  const getParam = (key: string, defaultValue: string = '') => {
    if (!searchParams) return defaultValue;
    return searchParams.get(key) || defaultValue;
  };

  const getNumberParam = (key: string, defaultValue: number = 0) => {
    if (!searchParams) return defaultValue;
    const value = searchParams.get(key);
    return value ? Number(value) : defaultValue;
  };

  // Khởi tạo state từ URL params với xử lý null safety
  const [search, setSearch] = useState(getParam('name'));
  const [tempStatus, setTempStatus] = useState(getParam('status', 'all'));
  const [tempCategory, setTempCategory] = useState(getParam('category', 'all'));
  const [tempSortField, setTempSortField] = useState(getParam('sortBy', 'all'));
  const [tempSortDirection, setTempSortDirection] = useState(getParam('sortDirection', 'asc'));
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Range filter state - khởi tạo từ URL params với xử lý null safety
  const [branchRange, setBranchRange] = useState<number[]>([
    getNumberParam('minBranches', 0),
    getNumberParam('maxBranches', 10)
  ]);
  const [packageRange, setPackageRange] = useState<number[]>([
    getNumberParam('minPackages', 0),
    getNumberParam('maxPackages', 10)
  ]);
  const [orderRange, setOrderRange] = useState<number[]>([
    getNumberParam('minOrders', 0),
    getNumberParam('maxOrders', 100)
  ]);
  const [ratingRange, setRatingRange] = useState<number[]>([
    getNumberParam('minRating', 0),
    getNumberParam('maxRating', 5)
  ]);
  const [priorityRange, setPriorityRange] = useState<number[]>([
    getNumberParam('minPriority', 0),
    getNumberParam('maxPriority', 10)
  ]);

  // Date filter state
  const [joinDateFrom, setJoinDateFrom] = useState(getParam('joinDateFrom'));
  const [joinDateTo, setJoinDateTo] = useState(getParam('joinDateTo'));
  const [openDialog, setOpenDialog] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Đồng bộ state search với URL khi searchParams thay đổi (ví dụ khi chuyển trang)
  useEffect(() => {
    setSearch(searchParams?.get('name') || '');
  }, [searchParams]);

  const handleSuccess = () => {
    setOpenDialog(false);
    router.refresh();
  };

  const handleApply = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      // Thêm search term hiện tại
      if (search) params.set("name", search);

      // Thêm các tham số filter và sort
      if (tempStatus && tempStatus !== 'all') params.set("status", tempStatus);
      if (tempCategory && tempCategory !== 'all') params.set("category", tempCategory);
      if (tempSortField && tempSortField !== 'all') params.set("sortBy", tempSortField);
      if (tempSortDirection) params.set("sortDirection", tempSortDirection);

      // Range filter - chỉ thêm nếu có giá trị khác mặc định
      if (branchRange[0] > 0 || branchRange[1] < 10) {
        params.set("minBranches", String(branchRange[0]));
        params.set("maxBranches", String(branchRange[1]));
      }
      if (packageRange[0] > 0 || packageRange[1] < 10) {
        params.set("minPackages", String(packageRange[0]));
        params.set("maxPackages", String(packageRange[1]));
      }
      if (orderRange[0] > 0 || orderRange[1] < 100) {
        params.set("minOrders", String(orderRange[0]));
        params.set("maxOrders", String(orderRange[1]));
      }
      if (ratingRange[0] > 0 || ratingRange[1] < 5) {
        params.set("minRating", String(ratingRange[0]));
        params.set("maxRating", String(ratingRange[1]));
      }
      if (priorityRange[0] > 0 || priorityRange[1] < 10) {
        params.set("minPriority", String(priorityRange[0]));
        params.set("maxPriority", String(priorityRange[1]));
      }

      // Date filter
      if (joinDateFrom) params.set("joinDateFrom", joinDateFrom);
      if (joinDateTo) params.set("joinDateTo", joinDateTo);

      // Reset về trang 1 khi áp dụng filter
      params.set("current", "1");

      router.push(`?${params.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      setSearch("");
      setTempStatus('all');
      setTempCategory('all');
      setTempSortField('all');
      setTempSortDirection('asc');
      setBranchRange([0, 10]);
      setPackageRange([0, 10]);
      setOrderRange([0, 100]);
      setRatingRange([0, 5]);
      setPriorityRange([0, 10]);
      setJoinDateFrom('');
      setJoinDateTo('');
      router.push("?current=1");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("current", page.toString());
    router.push(`?${params.toString()}`);
  };

  const columns: Column<IVendorListItem>[] = [
    {
      id: "logo",
      header: "Logo",
      cell: (vendor) => <VendorAvatar src={vendor.logo || ""} alt={vendor.name} />,
    },
    {
      id: "name",
      header: "Tên nhà cung cấp",
      cell: (vendor) => (
        <div className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
          {vendor.name}
        </div>
      )
    },
    {
      id: "contact",
      header: "Liên hệ",
      cell: (vendor) => <ContactInfo email={vendor.contact.email} phone={vendor.contact.phone} />,
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: (vendor) => statusBox(vendor.status),
    },
    {
      id: "branchCount",
      header: "Số chi nhánh",
      cell: (vendor) => (
        <div className="flex items-center gap-2">
          <LucideIcon name="MapPin" className="text-blue-500" iconSize={16} />
          <span className="font-medium">{vendor.branchCount}</span>
        </div>
      )
    },
    {
      id: "packageCount",
      header: "Số package",
      cell: (vendor) => (
        <div className="flex items-center gap-2">
          <LucideIcon name="Package" className="text-purple-500" iconSize={16} />
          <span className="font-medium">{vendor.packageCount}</span>
        </div>
      )
    },
    {
      id: "orderCount",
      header: "Số order",
      cell: (vendor) => (
        <div className="flex items-center gap-2">
          <LucideIcon name="ShoppingCart" className="text-green-500" iconSize={16} />
          <span className="font-medium">{vendor.orderCount}</span>
        </div>
      )
    },
    {
      id: "averageRating",
      header: "Đánh giá",
      cell: (vendor) => (
        <div className="flex items-center gap-2">
          <LucideIcon name="Star" className="text-yellow-500 fill-current" iconSize={16} />
          <span className="font-medium">{vendor.averageRating.toFixed(1)}</span>
        </div>
      )
    },
    {
      id: "priority",
      header: "Độ ưu tiên",
      cell: (vendor) => (
        <div className="flex items-center gap-2">
          <LucideIcon name="TrendingUp" className="text-orange-500" iconSize={16} />
          <span className="font-medium">{vendor.priority}</span>
        </div>
      )
    },
    {
      id: "createdAt",
      header: "Ngày tham gia",
      cell: (vendor) => (
        <div className="text-sm text-gray-600">
          {formatDate(vendor.createdAt)}
        </div>
      )
    },
    {
      id: "actions",
      header: "",
      cell: (vendor) => (
        <Button
          variant="outline"
          title="Xem chi tiết"
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 px-3 py-2 rounded-lg"
        >
          <LucideIcon name="Eye" iconSize={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Quản lý nhà cung cấp
              </h1>
              <p className="text-gray-600 text-lg">
                Quản lý danh sách nhà cung cấp trong hệ thống
              </p>

            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
                onClick={() => setOpenDialog(true)}
              >
                <LucideIcon name="Plus" iconSize={20} />
                Tạo mới vendor
              </Button>
              <Button
                variant="success"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
              >
                <LucideIcon name="Download" iconSize={20} />
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LucideIcon name="Search" className="text-gray-400" iconSize={20} />
              </div>
              <Input
                placeholder="Tìm kiếm tên nhà cung cấp..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 w-full h-12 text-lg border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl transition-all duration-200"
              />

            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 h-12 px-6 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${showFilters ? 'ring-2 ring-orange-300' : ''
                }`}
            >
              <LucideIcon name="Filter" iconSize={20} />
              Bộ lọc
              <span className="text-sm">
                {showFilters ? '▲' : '▼'}
              </span>
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200 shadow-lg animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <LucideIcon name="Activity" className="text-blue-500" iconSize={16} />
                    Trạng thái
                  </label>
                  <Select
                    placeHolder="Trạng thái"
                    value={tempStatus}
                    onValueChange={setTempStatus}
                    options={STATUS_OPTIONS}
                    className="border border-blue-200 rounded-lg shadow-sm focus-within:border-blue-400 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <LucideIcon name="Tag" className="text-purple-500" iconSize={16} />
                    Danh mục
                  </label>
                  <Select
                    placeHolder="Danh mục"
                    value={tempCategory}
                    onValueChange={setTempCategory}
                    options={CATEGORY_OPTIONS}
                    className="border border-blue-200 rounded-lg shadow-sm focus-within:border-blue-400 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <LucideIcon name="MapPin" className="text-green-500" iconSize={16} />
                    Số chi nhánh ({branchRange[0]}-{branchRange[1]})
                  </label>
                  <RangeSlider
                    min={0}
                    max={10}
                    step={1}
                    value={branchRange}
                    onValueChange={setBranchRange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <LucideIcon name="Package" className="text-orange-500" iconSize={16} />
                    Số package ({packageRange[0]}-{packageRange[1]})
                  </label>
                  <RangeSlider
                    min={0}
                    max={10}
                    step={1}
                    value={packageRange}
                    onValueChange={setPackageRange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <LucideIcon name="ShoppingCart" className="text-red-500" iconSize={16} />
                    Số order ({orderRange[0]}-{orderRange[1]})
                  </label>
                  <RangeSlider
                    min={0}
                    max={100}
                    step={1}
                    value={orderRange}
                    onValueChange={setOrderRange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <LucideIcon name="Star" className="text-yellow-500" iconSize={16} />
                    Đánh giá ({ratingRange[0]}-{ratingRange[1]})
                  </label>
                  <RangeSlider
                    min={0}
                    max={5}
                    step={0.1}
                    value={ratingRange}
                    onValueChange={setRatingRange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <LucideIcon name="TrendingUp" className="text-indigo-500" iconSize={16} />
                    Độ ưu tiên ({priorityRange[0]}-{priorityRange[1]})
                  </label>
                  <RangeSlider
                    min={0}
                    max={10}
                    step={1}
                    value={priorityRange}
                    onValueChange={setPriorityRange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <LucideIcon name="Calendar" className="text-teal-500" iconSize={16} />
                    Ngày tham gia từ
                  </label>
                  <Input
                    type="date"
                    value={joinDateFrom}
                    onChange={e => setJoinDateFrom(e.target.value)}
                    className="w-full border border-blue-200 rounded-lg focus:border-blue-400 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <LucideIcon name="Calendar" className="text-teal-500" iconSize={16} />
                    Ngày tham gia đến
                  </label>
                  <Input
                    type="date"
                    value={joinDateTo}
                    onChange={e => setJoinDateTo(e.target.value)}
                    className="w-full border border-blue-200 rounded-lg focus:border-blue-400 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Sort Section */}
              <div className="mt-8 pt-6 border-t border-blue-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                      <LucideIcon name="ArrowUpDown" className="text-gray-500" iconSize={16} />
                      Sắp xếp theo
                    </label>
                    <Select
                      placeHolder="Sắp xếp theo"
                      value={tempSortField}
                      onValueChange={setTempSortField}
                      options={SORT_FIELDS}
                      className="border border-blue-200 rounded-lg shadow-sm focus-within:border-blue-400 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                      <LucideIcon name="ArrowUp" className="text-gray-500" iconSize={16} />
                      Thứ tự
                    </label>
                    <Select
                      placeHolder="Tăng/Giảm dần"
                      value={tempSortDirection}
                      onValueChange={setTempSortDirection}
                      options={SORT_DIRECTIONS}
                      className="border border-blue-200 rounded-lg shadow-sm focus-within:border-blue-400 transition-all duration-200"
                      disabled={tempSortField === 'all'}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-xl px-6 py-3 font-semibold transition-all duration-200 flex items-center gap-2"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  <LucideIcon name="RotateCcw" iconSize={18} />
                  Đặt lại bộ lọc
                </Button>
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  onClick={handleApply}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang áp dụng...
                    </>
                  ) : (
                    <>
                      <LucideIcon name="Check" iconSize={18} />
                      Áp dụng
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable<IVendorListItem>
            columns={columns}
            data={vendors}
            keyExtractor={(vendor: IVendorListItem, index: number) => `vendor-${vendor.id}-${index}`}
            pagination={{
              currentPage: pagination?.current,
              totalPages: pagination?.totalPage,
              totalItems: pagination?.totalItem,
              onPageChange: handlePageChange,
              itemsPerPage: pagination?.pageSize,
            }}
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <LucideIcon name="Users" className="text-gray-300 mb-4" iconSize={64} />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có nhà cung cấp nào</h3>
                <p className="text-gray-500 mb-4">Hãy thử điều chỉnh bộ lọc hoặc tạo nhà cung cấp mới</p>
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={() => setOpenDialog(true)}
                >
                  <LucideIcon name="Plus" iconSize={16} />
                  Tạo nhà cung cấp đầu tiên
                </Button>
              </div>
            }
          />
        </div>
      </div>

      <AddVendorDialog open={openDialog} onClose={() => setOpenDialog(false)} onSuccess={handleSuccess} />
    </div>
  );
} 
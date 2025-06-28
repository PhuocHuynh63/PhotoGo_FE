"use client";
import { IVendorListItem } from "@models/vendor/common.model";
import { IPagination } from "@models/metadata";
import { DataTable, Column } from "@components/Organisms/Table/data-table";
import Avatar from "@components/Atoms/AvatarImage";
import { Badge } from "@components/Atoms/Badge";
import Button from "@components/Atoms/Button";
import LucideIcon from "@components/Atoms/LucideIcon";
import Search from "@components/Molecules/Search/Search";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Select from "@components/Atoms/Select";
import Input from "@components/Atoms/Input";
import { RangeSlider } from "@components/Atoms/Slider/range-slider";
import AddVendorDialog from "@/pages/Admin/Components/AddVendorDialog";

interface AdminVendorsPageProps {
  vendors: IVendorListItem[];
  pagination: IPagination;
}

function ContactInfo({ email, phone }: { email: string; phone: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-800">{email}</span>
      <span className="text-xs text-gray-500">{phone}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = "gray";
  if (status === "hoạt động") color = "green";
  else if (status === "không hoạt động") color = "red";
  else if (status === "tạm ngưng") color = "yellow";
  return <Badge color={color}>{status}</Badge>;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN");
}

function VendorAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <AvatarPrimitive.Root className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
      <AvatarPrimitive.Image src={src} alt={alt} className="w-full h-full object-cover" />
      <AvatarPrimitive.Fallback className="text-gray-400">{alt?.[0] || "?"}</AvatarPrimitive.Fallback>
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
        <span className="inline-flex items-center gap-1 bg-green-500 text-white rounded-full px-4 py-1 text-xs font-semibold shadow">
          <LucideIcon name="CheckCircle" className="text-white" iconSize={14} />
          Hoạt động
        </span>
      );
    case 'không hoạt động':
      return (
        <span className="inline-flex items-center gap-1 bg-gray-400 text-white rounded-full px-4 py-1 text-xs font-semibold shadow">
          <LucideIcon name="PauseCircle" className="text-white" iconSize={14} />
          Không hoạt động
        </span>
      );
    case 'tạm ngưng':
      return (
        <span className="inline-flex items-center gap-1 bg-yellow-500 text-white rounded-full px-4 py-1 text-xs font-semibold shadow">
          <LucideIcon name="Pause" className="text-white" iconSize={14} />
          Tạm ngưng
        </span>
      );
    default:
      return <span className="inline-flex items-center gap-1 bg-white text-gray-500 border border-gray-300 rounded-full px-4 py-1 text-xs">--</span>;
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
  const rawSearchParams = useSearchParams();
  const searchParams = rawSearchParams || new URLSearchParams();
  const [search, setSearch] = useState(searchParams.get('name') || "");
  const [tempStatus, setTempStatus] = useState(searchParams.get('status') || 'all');
  const [tempCategory, setTempCategory] = useState(searchParams.get('category') || 'all');
  const [tempSortField, setTempSortField] = useState(searchParams.get('sortBy') || 'all');
  const [tempSortDirection, setTempSortDirection] = useState(searchParams.get('sortDirection') || 'asc');
  const [showFilters, setShowFilters] = useState(false);
  // Range filter state (dùng number[] thay vì [number, number])
  const [branchRange, setBranchRange] = useState<number[]>([0, 10]);
  const [packageRange, setPackageRange] = useState<number[]>([0, 10]);
  const [orderRange, setOrderRange] = useState<number[]>([0, 100]);
  const [ratingRange, setRatingRange] = useState<number[]>([0, 5]);
  const [priorityRange, setPriorityRange] = useState<number[]>([0, 10]);
  // Date filter state
  const [joinDateFrom, setJoinDateFrom] = useState(searchParams.get('joinDateFrom') || '');
  const [joinDateTo, setJoinDateTo] = useState(searchParams.get('joinDateTo') || '');
    const [openDialog, setOpenDialog] = useState(false);

  const handleSuccess = () => {
    setOpenDialog(false);
    router.refresh();
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (search) params.set("name", search); else params.delete("name");
    if (tempStatus && tempStatus !== 'all') params.set("status", tempStatus); else params.delete("status");
    if (tempCategory && tempCategory !== 'all') params.set("category", tempCategory); else params.delete("category");
    if (tempSortField && tempSortField !== 'all') params.set("sortBy", tempSortField); else params.delete("sortBy");
    if (tempSortDirection) params.set("sortDirection", tempSortDirection); else params.delete("sortDirection");
    // Range filter
    params.set("minBranches", String(branchRange[0]));
    params.set("maxBranches", String(branchRange[1]));
    params.set("minPackages", String(packageRange[0]));
    params.set("maxPackages", String(packageRange[1]));
    params.set("minOrders", String(orderRange[0]));
    params.set("maxOrders", String(orderRange[1]));
    params.set("minRating", String(ratingRange[0]));
    params.set("maxRating", String(ratingRange[1]));
    params.set("minPriority", String(priorityRange[0]));
    params.set("maxPriority", String(priorityRange[1]));
    // Date filter
    if (joinDateFrom) params.set("joinDateFrom", joinDateFrom); else params.delete("joinDateFrom");
    if (joinDateTo) params.set("joinDateTo", joinDateTo); else params.delete("joinDateTo");
    params.set("current", "1");
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
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
  };

  const handlePageChange = (page: number) => {
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
    { id: "name", header: "Tên nhà cung cấp", cell: (vendor) => vendor.name },
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
    { id: "branchCount", header: "Số chi nhánh", cell: (vendor) => vendor.branchCount },
    { id: "packageCount", header: "Số package", cell: (vendor) => vendor.packageCount },
    { id: "orderCount", header: "Số order", cell: (vendor) => vendor.orderCount },
    { id: "averageRating", header: "Đánh giá", cell: (vendor) => vendor.averageRating },
    { id: "priority", header: "Độ ưu tiên", cell: (vendor) => vendor.priority },
    { id: "createdAt", header: "Ngày tham gia", cell: (vendor) => formatDate(vendor.createdAt) },
    {
      id: "actions",
      header: "",
      cell: (vendor) => (
        <Button variant="outline" title="Xem chi tiết">
          <LucideIcon name="Eye" iconSize={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý nhà cung cấp</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách nhà cung cấp trong hệ thống</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold rounded-lg px-5 py-2 shadow hover:opacity-90 flex items-center gap-2"
            onClick={() => setOpenDialog(true)}
          >
            <LucideIcon name="Plus" iconSize={18} />
            Tạo mới vendor
          </Button>
          <Button
            variant="success"
            className="bg-green-500 text-white font-bold rounded-lg px-5 py-2 shadow flex items-center gap-2"
          >
            <LucideIcon name="Download" />
            Xuất Excel
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Tìm kiếm tên nhà cung cấp..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xl flex-1"
        />
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 min-w-[120px] bg-orange-300 text-white rounded-full px-5 py-2 shadow font-semibold hover:bg-orange-400 transition`}
        >
          <LucideIcon name="Filter" iconSize={18} />
          Bộ lọc {showFilters ? <span>&#94;</span> : <span>&#8964;</span>}
        </Button>
      </div>
      {showFilters && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-blue-100 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col min-w-[180px]">
              <label className="font-semibold text-sm mb-1">Trạng thái</label>
              <Select
                placeHolder="Trạng thái"
                value={tempStatus}
                onValueChange={setTempStatus}
                options={STATUS_OPTIONS}
                className="border border-blue-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
              />
            </div>
            <div className="flex flex-col min-w-[180px]">
              <label className="font-semibold text-sm mb-1">Danh mục</label>
              <Select
                placeHolder="Danh mục"
                value={tempCategory}
                onValueChange={setTempCategory}
                options={CATEGORY_OPTIONS}
                className="border border-blue-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
              />
            </div>
            <div className="flex flex-col min-w-[200px]">
              <label className="font-semibold text-sm mb-1">Số chi nhánh</label>
              <RangeSlider min={0} max={10} step={1} value={branchRange} onValueChange={setBranchRange} className="w-40" />
              <div className="flex justify-between text-xs mt-1">
                <span>{branchRange[0]}</span>
                <span>{branchRange[1]}</span>
              </div>
            </div>
            <div className="flex flex-col min-w-[200px]">
              <label className="font-semibold text-sm mb-1">Số package</label>
              <RangeSlider min={0} max={10} step={1} value={packageRange} onValueChange={setPackageRange} className="w-40" />
              <div className="flex justify-between text-xs mt-1">
                <span>{packageRange[0]}</span>
                <span>{packageRange[1]}</span>
              </div>
            </div>
            <div className="flex flex-col min-w-[200px]">
              <label className="font-semibold text-sm mb-1">Số order</label>
              <RangeSlider min={0} max={100} step={1} value={orderRange} onValueChange={setOrderRange} className="w-40" />
              <div className="flex justify-between text-xs mt-1">
                <span>{orderRange[0]}</span>
                <span>{orderRange[1]}</span>
              </div>
            </div>
            <div className="flex flex-col min-w-[200px]">
              <label className="font-semibold text-sm mb-1">Đánh giá</label>
              <RangeSlider min={0} max={5} step={0.1} value={ratingRange} onValueChange={setRatingRange} className="w-40" />
              <div className="flex justify-between text-xs mt-1">
                <span>{ratingRange[0]}</span>
                <span>{ratingRange[1]}</span>
              </div>
            </div>
            <div className="flex flex-col min-w-[200px]">
              <label className="font-semibold text-sm mb-1">Độ ưu tiên</label>
              <RangeSlider min={0} max={10} step={1} value={priorityRange} onValueChange={setPriorityRange} className="w-40" />
              <div className="flex justify-between text-xs mt-1">
                <span>{priorityRange[0]}</span>
                <span>{priorityRange[1]}</span>
              </div>
            </div>
            <div className="flex flex-col min-w-[180px]">
              <label className="font-semibold text-sm mb-1">Ngày tham gia từ</label>
              <Input type="date" value={joinDateFrom} onChange={e => setJoinDateFrom(e.target.value)} className="w-40" />
            </div>
            <div className="flex flex-col min-w-[180px]">
              <label className="font-semibold text-sm mb-1">Ngày tham gia đến</label>
              <Input type="date" value={joinDateTo} onChange={e => setJoinDateTo(e.target.value)} className="w-40" />
            </div>
          </div>
          <div className="w-full border-t border-blue-200 my-6"></div>
          <div className="flex flex-col items-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end w-full justify-center">
              <div className="flex flex-col min-w-[180px]">
                <label className="font-semibold text-sm mb-1">Sắp xếp theo</label>
                <Select
                  placeHolder="Sắp xếp theo"
                  value={tempSortField}
                  onValueChange={setTempSortField}
                  options={SORT_FIELDS}
                  className="border border-blue-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                />
              </div>
              <div className="flex flex-col min-w-[140px]">
                <label className="font-semibold text-sm mb-1">Tăng/Giảm dần</label>
                <Select
                  placeHolder="Tăng/Giảm dần"
                  value={tempSortDirection}
                  onValueChange={setTempSortDirection}
                  options={SORT_DIRECTIONS}
                  className="border border-blue-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                  disabled={tempSortField === 'all'}
                />
              </div>
            </div>
            <div className="flex flex-row gap-2 w-full justify-center mt-4">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-200 border border-gray-300"
                onClick={handleReset}
              >
                Đặt lại bộ lọc
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
        </div>
      )}
      <DataTable<IVendorListItem>
        columns={columns}
        data={vendors}
        keyExtractor={(vendor) => vendor.id}
        pagination={{
          currentPage: pagination.current,
          totalPages: pagination.totalPage,
          totalItems: pagination.totalItem,
          onPageChange: handlePageChange,
          itemsPerPage: pagination.pageSize,
        }}
        emptyState={<div>Không có nhà cung cấp nào</div>}
      />
      <AddVendorDialog open={openDialog} onClose={() => setOpenDialog(false)} onSuccess={handleSuccess} />
    </div>
  );
} 
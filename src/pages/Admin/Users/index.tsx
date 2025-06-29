'use client';

import { IUser } from "@models/user/common.model";
import { IPagination } from "@models/metadata";
import { Button } from "@components/Atoms/Button/Button";
import Search from "@components/Molecules/Search/Search";
import { DataTable, Column } from "@components/Organisms/Table/data-table";
import { Avatar } from "@components/Molecules/Avatar";
import LucideIcon from "@components/Atoms/LucideIcon";
import Select from "@components/Atoms/Select";
import { useState, useEffect } from "react";
import { AvatarWithBorder } from "@components/Organisms/AvatarBorder";
import type { Rank } from "@components/Organisms/AvatarBorder/rankStyles";
import { useRouter, useSearchParams } from "next/navigation";
import AddUserDialog from "../Components/AddUserDialog";

const ROLE_OPTIONS = [
  { value: 'Tất cả', icon: 'User', name: 'Tất cả' },
  { value: 'R001', icon: 'User', name: 'Khách hàng' },
  { value: 'R002', icon: 'Camera', name: 'Nhiếp ảnh' },
  { value: 'R003', icon: 'Brush', name: 'Trang điểm' },
  { value: 'R005', icon: 'Shield', name: 'Quản trị viên' },
  { value: 'R006', icon: 'Users', name: 'Nhân viên' },
  { value: 'R007', icon: 'User', name: 'Khách vãng lai' },
  { value: 'R008', icon: 'Store', name: 'Chủ cửa hàng' },
];
const STATUS_OPTIONS = [
  { value: 'Tất cả', icon: 'Circle', name: 'Tất cả' },
  { value: 'hoạt động', icon: 'CheckCircle', name: 'Hoạt động' },
  { value: 'không hoạt động', icon: 'PauseCircle', name: 'Không hoạt động' },
  { value: 'bị tạm ngưng', icon: 'Pause', name: 'Bị tạm ngưng' },
];
const RANK_OPTIONS = [
  { value: 'Tất cả', icon: '', name: 'Tất cả' },
  { value: 'Đồng', icon: '', name: 'Đồng' },
  { value: 'Bạc', icon: 'Medal', name: 'Bạc' },
  { value: 'Vàng', icon: 'Star', name: 'Vàng' },
  { value: 'Kim cương', icon: 'Gem', name: 'Kim cương' },
];
const SORT_FIELDS = [
  { value: 'fullName', name: 'Tên' },
  { value: 'email', name: 'Email' },
  { value: 'phoneNumber', name: 'Số điện thoại' },
  { value: 'rank', name: 'Hạng' },
  { value: 'lastLoginAt', name: 'Lần đăng nhập cuối' },
];
const SORT_DIRECTIONS = [
  { value: 'asc', icon: 'ArrowUp', name: 'Tăng dần' },
  { value: 'desc', icon: 'ArrowDown', name: 'Giảm dần' },
];

interface AdminUsersPageProps {
  users: IUser[];
  pagination: IPagination;
}

export default function AdminUsersPage({ users, pagination }: AdminUsersPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchValue = searchParams?.get('q') || '';
  const statusValue = searchParams?.get('status') || '';
  const rankValue = searchParams?.get('rank') || '';
  const roleValue = searchParams?.get('role') || '';
  const sortFieldValue = searchParams?.get('sortBy') || '';
  const sortDirectionValue = searchParams?.get('sortDirection') || '';

  // State tạm cho filter/sort
  const [tempStatus, setTempStatus] = useState(statusValue);
  const [tempRank, setTempRank] = useState(rankValue);
  const [tempRole, setTempRole] = useState(roleValue);
  const [tempSortField, setTempSortField] = useState(sortFieldValue);
  const [tempSortDirection, setTempSortDirection] = useState(sortDirectionValue);
  const [showFilters, setShowFilters] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  // Đồng bộ state tạm với URL khi URL thay đổi
  useEffect(() => {
    setTempStatus(statusValue);
    setTempRank(rankValue);
    setTempRole(roleValue);
    setTempSortField(sortFieldValue);
    setTempSortDirection(sortDirectionValue);
  }, [statusValue, rankValue, roleValue, sortFieldValue, sortDirectionValue]);

  // Hàm cập nhật query string khi bấm Áp dụng
  const handleApply = () => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (tempStatus && tempStatus !== 'Tất cả') params.set('status', tempStatus); else params.delete('status');
    if (tempRank && tempRank !== 'Tất cả') params.set('rank', tempRank); else params.delete('rank');
    if (tempRole && tempRole !== 'Tất cả') params.set('role', tempRole); else params.delete('role');
    params.delete('roleId');
    if (tempSortField) params.set('sortBy', tempSortField); else params.delete('sortBy');
    if (tempSortDirection) params.set('sortDirection', tempSortDirection); else params.delete('sortDirection');
    params.set('current', '1');
    router.push(`?${params.toString()}`);
  };

  // Đặt lại bộ lọc
  const handleReset = () => {
    setTempStatus('');
    setTempRank('');
    setTempRole('');
    setTempSortField('');
    setTempSortDirection('');
    router.push('?current=1');
  };

  // Phân trang
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('current', page.toString());
    router.push(`?${params.toString()}`);
  };

  // Icon ổ khóa theo trạng thái
  const lockButton = (status: string) => {
    switch (status?.trim().toLowerCase()) {
      case 'bị cấm':
      case 'bị tạm ngưng':
        return <LucideIcon name="Lock" iconSize={16} className="text-red-500" />;
      case 'không hoạt động':
        return <LucideIcon name="PauseCircle" iconSize={16} className="text-yellow-500" />;
      case 'hoạt động':
        return <LucideIcon name="Unlock" iconSize={16} className="text-green-600" />;
      default:
        return <LucideIcon name="Unlock" iconSize={16} className="text-gray-400" />;
    }
  };


  const statusBox = (status: string) => {
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

      case 'bị tạm ngưng':
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-500 text-white rounded-full px-4 py-1 text-xs font-semibold shadow">
            <LucideIcon name="Pause" className="text-white" iconSize={14} />
            Tạm ngưng
          </span>
        );
      default:
        return <span className="inline-flex items-center gap-1 bg-white text-gray-500 border border-gray-300 rounded-full px-4 py-1 text-xs">--</span>;
    }
  };

  // Định nghĩa columns cho DataTable
  const columns: Column<IUser>[] = [
    { id: 'id', header: 'ID', cell: (user) => user.id },
    {
      id: 'avatar', header: 'Avatar', cell: (user) => {
        const validRanks: Rank[] = ['Đồng', 'Bạc', 'Vàng', 'Kim Cương'];
        const userRank = typeof user.rank === 'string' ? user.rank.trim() : '';
        const rank = validRanks.includes(userRank as Rank) ? (userRank as Rank) : undefined;
        return (
          <AvatarWithBorder rank={rank}>
            <Avatar src={user.avatarUrl || ''} alt={user.fullName} size={36} />
          </AvatarWithBorder>
        );
      }
    },
    { id: 'fullName', header: 'Tên', cell: (user) => user.fullName },
    { id: 'email', header: 'Email', cell: (user) => user.email },
    { id: 'phoneNumber', header: 'Số điện thoại', cell: (user) => user.phoneNumber || '--' },
    {
      id: 'role', header: 'Vai trò', cell: (user) => {
        // mapping role id sang name tiếng Việt
        const found = ROLE_OPTIONS.find(opt => opt.value === user.role?.id);
        return found ? found.name : '--';
      }
    },
    { id: 'status', header: 'Trạng thái', cell: (user) => statusBox(user.status) },
    { id: 'lastLoginAt', header: 'Lần đăng nhập cuối', cell: (user) => user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '-' },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: (user) => (
        <div className="flex gap-2">
          <Button variant="outline" title="Khóa người dùng">
            {lockButton(user.status)}
          </Button>
          <Button variant="outline" title="Xem chi tiết">
            <LucideIcon name="Eye" iconSize={16} />
          </Button>
        </div>
      ),
    },
  ];

  // Search
  const handleSearch = (value: string) => {
    router.push(`?q=${value}`);
  };



  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề và nút thao tác */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách người dùng trong hệ thống</p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" onClick={() => setOpenCreate(true)}>
            <LucideIcon name="Plus" className="mr-1" /> Thêm người dùng
          </Button>
          <Button variant="outline">
            <LucideIcon name="Download" className="mr-1" /> Download Excel
          </Button>
        </div>
      </div>

      {/* Search và nút Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Search
          placeholder="Tìm kiếm người dùng..."
          value={searchValue}
          onChange={handleSearch}
          searchWidth="100%"
          className="flex-1 min-w-[250px] max-w-2xl"
        />
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
                  placeHolder="Hạng"
                  height="h-10"
                  selectIcon="Star"
                  value={tempRank}
                  onValueChange={setTempRank}
                  options={RANK_OPTIONS}
                  className="min-w-[160px] max-w-xs flex-1 border border-gray-200 rounded-lg shadow-sm focus-within:border-blue-400 transition"
                />
                <Select
                  placeHolder="Vai trò"
                  height="h-10"
                  selectIcon="Users"
                  value={tempRole}
                  onValueChange={setTempRole}
                  options={ROLE_OPTIONS}
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
      <AddUserDialog 
        open={openCreate} 
        onClose={() => setOpenCreate(false)} 
        onSuccess={() => {
          setOpenCreate(false);
          router.refresh();
        }}
      />
      {/* DataTable */}
      <DataTable<IUser>
        columns={columns}
        data={users}
        keyExtractor={(user) => user?.id}
        pagination={{
          currentPage: pagination?.current,
          totalPages: pagination?.totalPage,
          totalItems: pagination?.totalItem,
          onPageChange: handlePageChange,
          itemsPerPage: pagination?.pageSize,
        }}
        emptyState={<div>Không có người dùng nào</div>}
      />
    </div>
  );
} 
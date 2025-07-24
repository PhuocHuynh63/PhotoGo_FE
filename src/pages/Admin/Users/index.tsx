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
import { useRouter, useSearchParams } from "next/navigation";
import AddUserDialog from "./Components/AddUserDialog";
import userService from "@services/user";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@components/Atoms/ConfirmDialog";

const ROLE_OPTIONS = [
  { value: 'Tất cả', icon: 'User', name: 'Tất cả' },
  { value: 'R001', icon: 'User', name: 'Khách hàng' },
  { value: 'R002', icon: 'Camera', name: 'Nhiếp ảnh' },
  { value: 'R003', icon: 'Brush', name: 'Trang điểm' },
  { value: 'R005', icon: 'Shield', name: 'Quản trị viên' },
  { value: 'R006', icon: 'Users', name: 'Nhân viên' },
  { value: 'R008', icon: 'Store', name: 'Chủ cửa hàng' },
];
const STATUS_OPTIONS = [
  { value: 'Tất cả', icon: 'Circle', name: 'Tất cả' },
  { value: 'hoạt động', icon: 'CheckCircle', name: 'Hoạt động' },
  { value: 'không hoạt động', icon: 'PauseCircle', name: 'Không hoạt động' },
  { value: 'bị tạm ngưng', icon: 'Pause', name: 'Bị tạm ngưng' },
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
  // State loading cho từng user khi thao tác lock/unlock
  const [lockingUserIds, setLockingUserIds] = useState<string[]>([]);
  // State cho popup xác nhận
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user?: IUser;
    nextStatus?: string;
  }>({ open: false });

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
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1.5 text-xs font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            Hoạt động
          </span>
        );
      case 'không hoạt động':
        return (
          <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            Không hoạt động
          </span>
        );
      case 'bị tạm ngưng':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1.5 text-xs font-medium">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            Tạm ngưng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-full px-3 py-1.5 text-xs font-medium">
            <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
            --
          </span>
        );
    }
  };

  // Hàm xử lý lock/unlock user
  const handleToggleUserStatus = async (user: IUser) => {
    if (!user?.id) return;
    setLockingUserIds((prev) => [...prev, user.id]);
    const currentStatus = user.status?.trim().toLowerCase();
    const nextStatus = currentStatus === "bị tạm ngưng" ? "hoạt động" : "bị tạm ngưng";
    try {
      await userService.lockUser(user.id, nextStatus);
      toast.success(
        nextStatus === "hoạt động"
          ? "Đã cho phép người dùng hoạt động trở lại!"
          : "Đã tạm ngưng người dùng!"
      );
      router.refresh();
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLockingUserIds((prev) => prev.filter((id) => id !== user.id));
    }
  };

  // Hàm mở popup xác nhận
  const handleOpenConfirm = (user: IUser) => {
    const currentStatus = user.status?.trim().toLowerCase();
    const nextStatus = currentStatus === "bị tạm ngưng" ? "hoạt động" : "bị tạm ngưng";
    setConfirmDialog({ open: true, user, nextStatus });
  };

  // Hàm xác nhận đổi trạng thái
  const handleConfirmChangeStatus = async () => {
    if (!confirmDialog.user?.id || !confirmDialog.nextStatus) return;
    setLockingUserIds((prev) => [...prev, confirmDialog.user!.id]);
    try {
      await userService.lockUser(confirmDialog.user.id, confirmDialog.nextStatus);
      toast.success(
        confirmDialog.nextStatus === "hoạt động"
          ? "Đã cho phép người dùng hoạt động trở lại!"
          : "Đã tạm ngưng người dùng!"
      );
      setConfirmDialog({ open: false });
      router.refresh();
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLockingUserIds((prev) => prev.filter((id) => id !== confirmDialog.user!.id));
    }
  };

  // Định nghĩa columns cho DataTable
  const columns: Column<IUser>[] = [
    {
      id: 'id',
      header: 'ID',
      cell: (user) => (
        <span className="font-mono text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
          #{user.id}
        </span>
      )
    },
    {
      id: 'avatar',
      header: 'Avatar',
      cell: (user) => {
        return (
          <div className="flex items-center gap-3">
            <AvatarWithBorder subscription={user.subscription || undefined}>
              <Avatar src={user.avatarUrl || ''} alt={user.fullName} size={40} />
            </AvatarWithBorder>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>
        );
      }
    },
    {
      id: 'fullName',
      header: 'Tên',
      cell: (user) => (
        <div className="font-medium text-gray-900">{user.fullName}</div>
      )
    },
    {
      id: 'email',
      header: 'Email',
      cell: (user) => (
        <div className="text-sm text-gray-600 font-mono">{user.email}</div>
      )
    },
    {
      id: 'phoneNumber',
      header: 'Số điện thoại',
      cell: (user) => (
        <div className="text-sm text-gray-600">
          {user.phoneNumber || (
            <span className="text-gray-400 italic">Chưa cập nhật</span>
          )}
        </div>
      )
    },
    {
      id: 'role',
      header: 'Vai trò',
      cell: (user) => {
        const found = ROLE_OPTIONS.find(opt => opt.value === user.role?.id);
        return (
          <div className="flex items-center gap-2">
            {found?.icon && (
              <LucideIcon name={found.icon as any} iconSize={14} className="text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {found ? found.name : '--'}
            </span>
          </div>
        );
      }
    },
    {
      id: 'status',
      header: 'Trạng thái',
      cell: (user) => statusBox(user.status)
    },
    {
      id: 'lastLoginAt',
      header: 'Lần đăng nhập cuối',
      cell: (user) => (
        <div className="text-sm text-gray-600">
          {user.lastLoginAt ? (
            <div className="flex flex-col">
              <span>{new Date(user.lastLoginAt).toLocaleDateString('vi-VN')}</span>
              <span className="text-xs text-gray-400">
                {new Date(user.lastLoginAt).toLocaleTimeString('vi-VN')}
              </span>
            </div>
          ) : (
            <span className="text-gray-400 italic">Chưa đăng nhập</span>
          )}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: (user) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            title={user.status?.trim().toLowerCase() === 'bị tạm ngưng' ? 'Cho phép hoạt động' : 'Tạm ngưng người dùng'}
            className="h-8 w-8 p-0 hover:bg-gray-50"
            onClick={() => handleOpenConfirm(user)}
            disabled={lockingUserIds.includes(user.id)}
          >
            {lockingUserIds.includes(user.id) ? (
              <LucideIcon name="Loader2" iconSize={16} className="animate-spin text-blue-500" />
            ) : (
              lockButton(user.status)
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            title="Xem chi tiết"
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
          >
            <LucideIcon name="Eye" iconSize={14} className="text-blue-600" />
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            title="Chỉnh sửa"
            className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-200"
          >
            <LucideIcon name="Edit" iconSize={14} className="text-green-600" />
          </Button> */}
        </div>
      ),
    },
  ];

  // Search
  const handleSearch = (value: string) => {
    router.push(`?q=${value}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <LucideIcon name="Users" iconSize={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                  <p className="text-gray-600">Quản lý danh sách người dùng trong hệ thống</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="default"
                onClick={() => setOpenCreate(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25"
              >
                <LucideIcon name="Plus" className="mr-2" iconSize={16} />
                Thêm người dùng
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                <LucideIcon name="Download" className="mr-2" iconSize={16} />
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Search và Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-2xl">
              <Search
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchValue}
                onChange={handleSearch}
                searchWidth="100%"
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 ${showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <LucideIcon name="Filter" iconSize={16} />
              Bộ lọc
              <LucideIcon
                name={showFilters ? "ChevronUp" : "ChevronDown"}
                iconSize={16}
                className="transition-transform duration-200"
              />
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="space-y-6">
                {/* Filter Section */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <LucideIcon name="Filter" iconSize={16} className="text-blue-600" />
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
                      className="w-full border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                    />
                    <Select
                      placeHolder="Vai trò"
                      height="h-11"
                      selectIcon="Users"
                      value={tempRole}
                      onValueChange={setTempRole}
                      options={ROLE_OPTIONS}
                      className="w-full border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Sort Section */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <LucideIcon name="ArrowUpDown" iconSize={16} className="text-blue-600" />
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
                      className="w-full border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                    />
                    <Select
                      placeHolder="Thứ tự"
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-end pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full sm:w-auto border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <LucideIcon name="RotateCcw" className="mr-2" iconSize={16} />
                    Đặt lại
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleApply}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25"
                  >
                    <LucideIcon name="Check" className="mr-2" iconSize={16} />
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DataTable Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <LucideIcon name="Users" iconSize={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có người dùng nào</h3>
                <p className="text-gray-500 mb-4">Hãy thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <LucideIcon name="RotateCcw" className="mr-2" iconSize={16} />
                  Đặt lại bộ lọc
                </Button>
              </div>
            }
          />
        </div>

        {/* Add User Dialog */}
        <AddUserDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
            router.refresh();
          }}
        />
        {/* Popup xác nhận đổi trạng thái */}
        <ConfirmDialog
          isOpen={confirmDialog.open}
          title={confirmDialog.nextStatus === 'hoạt động' ? 'Cho phép hoạt động' : 'Tạm ngưng người dùng'}
          message={`Bạn có chắc chắn muốn ${confirmDialog.nextStatus === 'hoạt động' ? 'cho phép người dùng này hoạt động trở lại' : 'tạm ngưng người dùng này'}?`}
          confirmText="Xác nhận"
          cancelText="Hủy"
          onConfirm={handleConfirmChangeStatus}
          onCancel={() => setConfirmDialog({ open: false })}
          type={confirmDialog.nextStatus === 'hoạt động' ? 'info' : 'danger'}
        />
      </div>
    </div>
  );
} 
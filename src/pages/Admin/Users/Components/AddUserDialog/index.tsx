'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useToast } from '@components/Atoms/ui/use-toast';
import { AdminCreateUserRequest, IAdminCreateUserRequest } from '@models/user/request.model';
import userService from '@services/user';

import { Button } from '@components/Atoms/Button/Button';
import Input from '@components/Atoms/Input';
import Label from '@components/Atoms/Label';
import Select from '@components/Atoms/Select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/Molecules/Dialog';
import LucideIcon from '@components/Atoms/LucideIcon';

// Options for the creation form
const DIALOG_ROLE_OPTIONS = [
  { value: 'R001', icon: 'User', name: 'Khách hàng' },
  { value: 'R002', icon: 'Camera', name: 'Nhiếp ảnh' },
  { value: 'R003', icon: 'Brush', name: 'Trang điểm' },
  { value: 'R005', icon: 'Shield', name: 'Quản trị viên' },
  { value: 'R006', icon: 'Users', name: 'Nhân viên' },

  { value: 'R008', icon: 'Store', name: 'Chủ cửa hàng' },
];
const DIALOG_STATUS_OPTIONS = [
  { value: 'hoạt động', icon: 'CheckCircle', name: 'Hoạt động' },
  { value: 'không hoạt động', icon: 'PauseCircle', name: 'Không hoạt động' },
  { value: 'bị tạm ngưng', icon: 'Pause', name: 'Bị tạm ngưng' },
];

const initialNewUserState = {
  fullName: '',
  email: '',
  role: 'R001', // Default role
  status: 'hoạt động', // Default status
  password: '',
  phoneNumber: '',
};

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserDialog({ open, onClose, onSuccess }: AddUserDialogProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState(initialNewUserState);

  const handleCreateUser = async () => {
    setIsCreating(true);

    const userData: IAdminCreateUserRequest = {
      fullName: newUser.fullName.trim(),
      email: newUser.email.trim(),
      password: newUser.password,
      //phoneNumber: newUser.phoneNumber.trim(),
      roleId: newUser.role,
      status: newUser.status,
    };

    try {
      AdminCreateUserRequest.parse(userData);
    } catch (err) {
      setIsCreating(false);
      if (err instanceof z.ZodError) {
        err.errors.forEach(e => {
          toast({
            variant: 'destructive',
            description: e.message,
            duration: 4000,
          });
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Dữ liệu không hợp lệ!',
          duration: 4000,
        });
      }
      return;
    }

    try {
      await userService.adminCreateUser(userData);
      toast({
        description: 'Tạo người dùng thành công!',
        duration: 4000,
      });
      setNewUser(initialNewUserState); // Reset form after success
      onSuccess(); // This will trigger router.refresh() in the parent
    } catch (error: any) {
      console.error('Lỗi khi tạo user:', error);
      toast({
        variant: 'destructive',
        description: error?.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng',
        duration: 4000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setNewUser(initialNewUserState);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <LucideIcon name="UserPlus" iconSize={20} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-white">
                Tạo người dùng mới
              </DialogTitle>
              <p className="text-blue-100 text-sm mt-1">
                Thêm người dùng mới vào hệ thống
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            {/* <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <LucideIcon name="User" iconSize={16} className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">Thông tin cá nhân</h3>
            </div> */}

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="Nhập họ và tên đầy đủ"
                  className="h-11 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="example@email.com"
                  className="h-11 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Số điện thoại
                </Label>
                <Input
                  id="phoneNumber"
                  value={newUser.phoneNumber}
                  onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                  placeholder="0123456789"
                  className="h-11 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div> */}
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            {/* <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <LucideIcon name="Lock" iconSize={16} className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">Bảo mật</h3>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                className="h-11 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          </div>

          {/* Role & Status Section */}
          <div className="space-y-4">
            {/* <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <LucideIcon name="Settings" iconSize={16} className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">Cấu hình</h3>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Vai trò <span className="text-red-500">*</span>
                </Label>
                <Select
                  placeHolder="Chọn vai trò"
                  value={newUser.role}
                  onValueChange={value => setNewUser({ ...newUser, role: value })}
                  options={DIALOG_ROLE_OPTIONS}
                  height="h-11"
                  className="border-gray-200 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Trạng thái <span className="text-red-500">*</span>
                </Label>
                <Select
                  placeHolder="Chọn trạng thái"
                  value={newUser.status}
                  onValueChange={value => setNewUser({ ...newUser, status: value })}
                  options={DIALOG_STATUS_OPTIONS}
                  height="h-11"
                  className="border-gray-200 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="w-full sm:w-auto border-gray-200 text-gray-600 hover:bg-gray-50 h-11"
            >
              <LucideIcon name="X" className="mr-2" iconSize={16} />
              Hủy
            </Button>
            <Button
              onClick={handleCreateUser}
              isLoading={isCreating}
              disabled={!newUser.fullName || !newUser.email || !newUser.password}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 h-11"
            >
              {isCreating ? (
                <>
                  <LucideIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <LucideIcon name="UserPlus" className="mr-2" iconSize={16} />
                  Tạo người dùng
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

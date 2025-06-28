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
  { value: 'R001', name: 'Khách hàng' },
  { value: 'R002', name: 'Nhiếp ảnh' },
  { value: 'R003', name: 'Trang điểm' },
  { value: 'R005', name: 'Quản trị viên' },
  { value: 'R006', name: 'Nhân viên' },
  { value: 'R007', name: 'Khách vãng lai' },
  { value: 'R008', name: 'Chủ cửa hàng' },
];
const DIALOG_STATUS_OPTIONS = [
  { value: 'hoạt động', name: 'Hoạt động' },
  { value: 'không hoạt động', name: 'Không hoạt động' },
  { value: 'bị tạm ngưng', name: 'Bị tạm ngưng' },
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
      passwordHash: newUser.password,
      phoneNumber: newUser.phoneNumber.trim(),
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo người dùng mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">Họ và tên</Label>
            <Input
              id="fullName"
              className="col-span-3"
              value={newUser.fullName}
              onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
              placeholder="Nhập họ và tên"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input
              id="email"
              type="email"
              className="col-span-3"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Nhập email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">Điện thoại</Label>
            <Input
              id="phoneNumber"
              className="col-span-3"
              value={newUser.phoneNumber}
              onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              className="col-span-3"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Vai trò</Label>
            <div className="col-span-3">
              <Select
                placeHolder="Chọn vai trò"
                value={newUser.role}
                onValueChange={value => setNewUser({ ...newUser, role: value })}
                options={DIALOG_ROLE_OPTIONS}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Trạng thái</Label>
            <div className="col-span-3">
              <Select
                placeHolder="Chọn trạng thái"
                value={newUser.status}
                onValueChange={value => setNewUser({ ...newUser, status: value })}
                options={DIALOG_STATUS_OPTIONS}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Hủy
          </Button>
          <Button onClick={handleCreateUser} isLoading={isCreating}>
            {isCreating ? (
              <>
                <LucideIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo người dùng'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

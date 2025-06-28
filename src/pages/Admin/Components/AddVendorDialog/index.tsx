'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { VendorCreateRequestModel, IVendorCreateRequest } from '@models/vendor/request.model';
import { ICategory } from '@models/category/common.model';
import { IUser } from '@models/user/common.model';
import { useVietnamAddress } from '@utils/hooks/useLocation/useVietnamAddress';
import categoryService from '@services/categories';
import userService from '@services/user';
import vendorService from '@services/vendors';

// Atomic Design Components
import TipTapEditor from '@components/Organisms/TipTapEditor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/Molecules/Dialog';
import Button from '@components/Atoms/Button';
import Input from '@components/Atoms/Input';
import Select from '@components/Atoms/Select';
import Label from '@components/Atoms/Label';
import Upload from '@components/Molecules/Upload';

interface AddVendorDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Extend the schema for the form to include the email search field
const DialogFormSchema = VendorCreateRequestModel.extend({
  email: z.string().email('Email không hợp lệ').optional(),
  status: z.enum(['hoạt động', 'không hoạt động', 'tạm ngưng']),
});

type IDialogForm = z.infer<typeof DialogFormSchema>;

const AddVendorDialog: React.FC<AddVendorDialogProps> = ({ open, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchingUser, setSearchingUser] = useState(false);
  const [foundUser, setFoundUser] = useState<IUser | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<IDialogForm>({
    resolver: zodResolver(DialogFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      category_id: '',
      user_id: '',
      email: '',
      description: '',
      status: 'hoạt động',
      locations: [
        {
          address: '',
          ward: '',
          district: '',
          province: '',
        },
      ],
    },
  });

  const {
    provinces,
    districts,
    wards,
    fetchDistricts,
    fetchWards,
  } = useVietnamAddress();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories() as any;

        // The actual array can be at response.data.data, response.data, or response itself.
        const categoriesList = response?.data?.data || response?.data || response;

        if (Array.isArray(categoriesList)) {
          setCategories(categoriesList);
        } else {
          console.error('Fetched categories data is not an array:', categoriesList);
          setCategories([]); // Default to empty array on failure
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]); // Default to empty array on error
      }
    };

    fetchCategories();
  }, []);

  const handleSearchUser = async () => {
    const email = watch('email');
    if (!email) {
      toast.error('Vui lòng nhập email người phụ trách');
      return;
    }
    setSearchingUser(true);
    try {
      const response = await userService.getAUserByEmail(email) as { data: IUser | null };
      if (response.data) {
        setFoundUser(response.data);
        setValue('user_id', response.data.id);
        toast.success(`Đã tìm thấy người dùng: ${response.data.fullName}`);
      } else {
        setFoundUser(null);
        setValue('user_id', '');
        toast.error('Không tìm thấy người dùng với email này');
      }
    } catch (error) {
      setFoundUser(null);
      setValue('user_id', '');
      toast.error('Lỗi khi tìm kiếm người dùng');
    } finally {
      setSearchingUser(false);
    }
  };

  const onSubmit: SubmitHandler<IDialogForm> = async (data) => {
    setLoading(true);
    try {
      // Create a mutable copy for submission
      const submissionData: Partial<IDialogForm> = { ...data };
      delete submissionData.email;

      const formData = new FormData();

      // Handle location: create a stringified JSON object and append it as 'location'.
      if (submissionData.locations && submissionData.locations[0] && submissionData.locations[0].province) {
        const originalLocation = submissionData.locations[0];

        const locationPayload = {
          address: originalLocation.address,
          district: originalLocation.district,
          ward: originalLocation.ward,
          city: originalLocation.province,
          province: originalLocation.province,
          latitude: 10.7769,
          longitude: 106.7009,
        };
        formData.append('location', JSON.stringify(locationPayload));
      }

      // Remove 'locations' from the main object to prevent it from being appended.
      delete submissionData.locations;

      // Append the rest of the form data.
      Object.keys(submissionData).forEach(key => {
        const value = submissionData[key as keyof typeof submissionData];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (logoFile) {
        formData.append('logo', logoFile);
      }
      if (bannerFile) {
        formData.append('banner', bannerFile);
      }

      await vendorService.createVendor(formData);
      toast.success('Tạo nhà cung cấp thành công!');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error('Tạo nhà cung cấp thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setFoundUser(null);
    setLogoFile(null);
    setBannerFile(null);
    onClose();
  };

  const watchedLocation = watch('locations.0');

  // Log errors to the console to diagnose validation issues
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo mới Nhà cung cấp</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết để tạo một nhà cung cấp mới. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
            {/* Row 1 */}
            <div className="col-span-1">
              <Label htmlFor="name">Tên nhà cung cấp *</Label>
              <Controller name="name" control={control} render={({ field }) => <Input id="name" {...field} />} />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div className="col-span-1">
              <Label htmlFor="category_id">Danh mục *</Label>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    placeHolder="Chọn danh mục"
                    options={categories.map(category => ({ value: category.id, name: category.name }))}
                  />
                )}
              />
              {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id.message}</p>}
            </div>

            {/* Row 2 */}
            <div className="col-span-2">
              <Label htmlFor="email">Email người phụ trách</Label>
              <div className="flex items-center gap-2">
                <Controller name="email" control={control} render={({ field }) => <Input id="email" {...field} placeholder="Nhập email để tìm kiếm" className="flex-grow" />} />
                <Button onClick={handleSearchUser} isLoading={searchingUser}>Kiểm tra</Button>
              </div>
              {foundUser && (
                <p className="text-sm text-green-600 mt-1">Đã tìm thấy: {foundUser.fullName} ({foundUser.email})</p>
              )}
            </div>
            
            {/* Row 3 */}
            <div className="col-span-2">
              <Label htmlFor="user_id">User ID *</Label>
              <Controller name="user_id" control={control} render={({ field }) => <Input id="user_id" {...field} disabled placeholder="User ID sẽ được điền tự động" />} />
              {errors.user_id && <p className="text-sm text-red-500 mt-1">{errors.user_id.message}</p>}
            </div>

            {/* Row 4 */}
            <div className="col-span-2">
              <Label>Mô tả</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <TipTapEditor value={field.value || ''} onChange={field.onChange} />}
              />
            </div>

            {/* Address Section */}
            <div className="col-span-2 space-y-4">
              <Label className="text-base font-medium">Địa chỉ</Label>
              <div className="grid grid-cols-3 gap-4">
                  <Controller
                    name="locations.0.province"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedProvince = provinces.find((p: any) => p.name === value);
                          if (selectedProvince) {
                            setValue('locations.0.district', '');
                            setValue('locations.0.ward', '');
                            fetchDistricts(selectedProvince.code.toString());
                          }
                        }}
                        placeHolder="Tỉnh/Thành phố"
                        options={provinces.map(p => ({ value: p.name, name: p.name }))}
                      />
                    )}
                  />
                  <Controller
                    name="locations.0.district"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        disabled={!watch('locations.0.province')}
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedDistrict = districts.find((d: any) => d.name === value);
                          if (selectedDistrict) {
                            setValue('locations.0.ward', '');
                            fetchWards(selectedDistrict.code.toString());
                          }
                        }}
                        placeHolder="Quận/Huyện"
                        options={districts.map(d => ({ value: d.name, name: d.name }))}
                      />
                    )}
                  />
                  <Controller
                    name="locations.0.ward"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        placeHolder="Phường/Xã"
                        disabled={!watch('locations.0.district')}
                        options={wards.map((w: { code: number; name: string }) => ({ value: w.name, name: w.name }))}
                      />
                    )}
                  />
              </div>
              <Controller name="locations.0.address" control={control} render={({ field }) => <Input {...field} placeholder="Địa chỉ chi tiết (số nhà, tên đường...)" />} />

            </div>

            {/* Upload Section */}
            <div className="col-span-1">
              <Label>Logo</Label>
              <Upload onFileChange={setLogoFile} />
            </div>
            <div className="col-span-1">
              <Label>Banner</Label>
              <Upload onFileChange={setBannerFile} />
            </div>
          </div>

        <DialogFooter>
          <Button onClick={handleClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Hủy</Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={loading} className="bg-blue-600 text-white hover:bg-blue-700">Tạo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVendorDialog;

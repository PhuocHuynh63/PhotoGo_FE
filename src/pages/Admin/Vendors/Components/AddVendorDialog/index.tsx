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
    //console.log('Form Errors:', errors);
  }, [errors]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-[1400px] w-[98vw] h-[98vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-0 flex flex-col">
        {/* Header with Glassmorphism Effect */}
        <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-6">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/25">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent mb-3">
              Tạo mới Nhà cung cấp
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-lg font-medium">
              Điền thông tin chi tiết để tạo một nhà cung cấp mới. Các trường có dấu <span className="text-red-500 font-bold">*</span> là bắt buộc.
            </DialogDescription>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 scroll-smooth [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-slate-100/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-purple-400 [&::-webkit-scrollbar-thumb]:to-indigo-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-purple-500 [&::-webkit-scrollbar-thumb]:hover:to-indigo-600">
          <div className="max-w-3xl mx-auto space-y-6 pb-6">
            {/* Basic Information Section */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-white/50 hover:shadow-xl hover:shadow-purple-200/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Thông tin cơ bản</h3>
                  <p className="text-slate-500 text-sm">Nhập thông tin cơ bản của nhà cung cấp</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="text-red-500 text-lg">*</span>
                    Tên nhà cung cấp
                  </Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="name"
                        {...field}
                        className="h-12 border-slate-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        placeholder="Nhập tên nhà cung cấp..."
                      />
                    )}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-600 font-medium">{errors.name.message}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="category_id" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="text-red-500 text-lg">*</span>
                    Danh mục
                  </Label>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        placeHolder="Chọn danh mục"
                        options={categories.map(category => ({ value: category.id, name: category.name }))}
                        className="h-12 border-slate-200 focus:border-purple-400 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm relative z-[9999]"
                      />
                    )}
                  />
                  {errors.category_id && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-600 font-medium">{errors.category_id.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Assignment Section */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-white/50 hover:shadow-xl hover:shadow-emerald-200/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:shadow-lg group-hover:shadow-emerald-500/40 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Phân công người phụ trách</h3>
                  <p className="text-slate-500 text-sm">Tìm kiếm và phân công người phụ trách</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-700">
                    Email người phụ trách
                  </Label>
                  <div className="flex items-center gap-3">
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="email"
                          {...field}
                          placeholder="Nhập email để tìm kiếm người dùng..."
                          className="flex-grow h-12 border-slate-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        />
                      )}
                    />
                    <Button
                      onClick={handleSearchUser}
                      isLoading={searchingUser}
                      className="h-12 px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Tìm kiếm
                    </Button>
                  </div>
                  {foundUser && (
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-emerald-800 text-lg">{foundUser.fullName}</p>
                          <p className="text-sm text-emerald-600">{foundUser.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="user_id" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="text-red-500 text-lg">*</span>
                    User ID
                  </Label>
                  <Controller
                    name="user_id"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="user_id"
                        {...field}
                        disabled
                        placeholder="User ID sẽ được điền tự động sau khi tìm kiếm"
                        className="h-14 border-slate-200 bg-slate-50 rounded-2xl"
                      />
                    )}
                  />
                  {errors.user_id && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-600 font-medium">{errors.user_id.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-white/50 hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:shadow-lg group-hover:shadow-orange-500/40 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Địa chỉ</h3>
                  <p className="text-slate-500 text-sm">Thông tin địa chỉ của nhà cung cấp</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Tỉnh/Thành phố</Label>
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
                          placeHolder="Chọn tỉnh/thành phố"
                          options={provinces.map(p => ({ value: p.name, name: p.name }))}
                          className="h-14 border-slate-200 focus:border-purple-400 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm relative z-[9999]"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Quận/Huyện</Label>
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
                          placeHolder={watch('locations.0.province') ? "Chọn quận/huyện" : "Chọn tỉnh trước"}
                          options={districts.map(d => ({ value: d.name, name: d.name }))}
                          className="h-14 border-slate-200 focus:border-purple-400 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm relative z-[9999]"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Phường/Xã</Label>
                    <Controller
                      name="locations.0.ward"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          placeHolder={watch('locations.0.district') ? "Chọn phường/xã" : "Chọn quận trước"}
                          disabled={!watch('locations.0.district')}
                          options={wards.map((w: { code: number; name: string }) => ({ value: w.name, name: w.name }))}
                          className="h-14 border-slate-200 focus:border-purple-400 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm relative z-[9999]"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">Địa chỉ chi tiết</Label>
                  <Controller
                    name="locations.0.address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Số nhà, tên đường, tòa nhà..."
                        className="h-14 border-slate-200 focus:border-purple-400 focus:ring-purple-400 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-white/50 hover:shadow-xl hover:shadow-purple-200/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:shadow-lg group-hover:shadow-purple-500/40 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Mô tả</h3>
                  <p className="text-slate-500 text-sm">Mô tả chi tiết về nhà cung cấp</p>
                </div>
              </div>

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                    <TipTapEditor value={field.value || ''} onChange={field.onChange} />
                  </div>
                )}
              />
            </div>

            {/* Media Upload Section */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-white/50 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:shadow-lg group-hover:shadow-indigo-500/40 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Hình ảnh</h3>
                  <p className="text-slate-500 text-sm">Upload logo và banner cho nhà cung cấp</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                    </svg>
                    Logo nhà cung cấp
                  </Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-300 bg-white/30 backdrop-blur-sm">
                    <Upload onFileChange={setLogoFile} />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Banner nhà cung cấp
                  </Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-purple-400 transition-colors duration-300 bg-white/30 backdrop-blur-sm">
                    <Upload onFileChange={setBannerFile} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 px-8 py-4 flex justify-end gap-3">
          <Button
            onClick={handleClose}
            className="h-12 px-6 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            isLoading={loading}
            className="h-12 px-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tạo nhà cung cấp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVendorDialog;

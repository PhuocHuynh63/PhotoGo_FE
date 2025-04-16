'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import Button from '@components/Atoms/Button'
import CustomDatePicker from '@components/Atoms/DatePicker'
import Input from '@components/Atoms/Input'
import Label from '@components/Atoms/Label'
import TextArea from '@components/Atoms/TextArea'

const studioData = {
  packages: [
    { id: 1, name: 'Gói Cơ Bản', price: '500.000đ' },
    { id: 2, name: 'Gói Chuyên Nghiệp', price: '1.200.000đ' },
  ],
}

const VendorBookingPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => {
    console.log('Dữ liệu gửi đi:', data)
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Đặt lịch dịch vụ</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="flex flex-col justify-center items-center space-y-4">
            <div>
              <Label htmlFor="service">Gói dịch vụ</Label>
              <select
                id="service"
                {...register('service', { required: 'Vui lòng chọn gói dịch vụ' })}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">Chọn gói dịch vụ</option>
                {studioData.packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.price}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="text-red-500 text-sm mt-1">{errors?.service?.message?.toString()}</p>
              )}
            </div>

            <div>
              <Label htmlFor="date">Ngày đặt lịch</Label>
              <div className="border rounded-md p-4 mt-1">
                <CustomDatePicker
                  value={watch('date') || new Date()}
                  onChange={(date) => setValue('date', date)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="time">Giờ đặt lịch</Label>
              <select
                id="time"
                {...register('time', { required: 'Vui lòng chọn giờ' })}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">Chọn giờ đặt lịch</option>
                {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(
                  (time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  )
                )}
              </select>
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time?.message?.toString()}</p>
              )}
            </div>
          </div>

          {/* <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                placeholder="Nhập họ và tên của bạn"
                {...register('name', { required: 'Vui lòng nhập họ tên' })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors?.name?.message?.toString()}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="Nhập số điện thoại liên hệ"
                {...register('phone', { required: 'Vui lòng nhập số điện thoại' })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors?.phone?.message?.toString()}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                {...register('email', { required: 'Vui lòng nhập email' })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors?.email?.message?.toString()}</p>
              )}
            </div>

            <div>
              <Label htmlFor="note">Ghi chú</Label>
              <TextArea
                id="note"
                placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt"
                rows={4}
                value={watch('note')}
                {...register('note')}
              />
            </div>
          </div> */}
        </div>

        <Button type="submit" className="w-full">
          Xác nhận đặt lịch
        </Button>
      </form>
    </>
  )
}

export default VendorBookingPage
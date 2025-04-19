'use client'

import Button from '@components/Atoms/Button';
import CustomDatePicker from '@components/Atoms/DatePicker';
import Label from '@components/Atoms/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/Molecules/Dialog';
import React from 'react'
import { useForm } from 'react-hook-form';

type ConceptProps = {
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
};

const Booking = ({ isOpen, onOpenChange }: ConceptProps) => {
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

    const studioData = {
        packages: [
            { id: 1, name: 'Gói Cơ Bản', price: '500.000đ' },
            { id: 2, name: 'Gói Chuyên Nghiệp', price: '1.200.000đ' },
        ],
    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTitle />
            <DialogContent className="xl:max-w-[400px] max-h-[100vh] overflow">
                <DialogHeader className="font-bold text-xl text-center border-b border-gray-200 pb-4 flex flex-row justify-between items-center">
                    <span>Đặt lịch</span>
                </DialogHeader>
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

                            <div className='w-full'>
                                <Label htmlFor="date">Ngày đặt lịch</Label>
                                <div className=" w-full rounded-md mt-1">
                                    <CustomDatePicker
                                        value={watch('date') || new Date()}
                                        onChange={(date) => setValue('date', date)}
                                    />
                                </div>
                            </div>

                            <div className='w-full'>
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
                    </div>

                    <Button type="submit" className="w-full">
                        Xác nhận đặt lịch
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default Booking
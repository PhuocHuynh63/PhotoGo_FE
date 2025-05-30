'use client'

import Button from '@components/Atoms/Button';
import CustomDatePicker from '@components/Atoms/DatePicker';
import Label from '@components/Atoms/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/Molecules/Dialog';
import React from 'react'
import { useForm } from 'react-hook-form';
import { IServiceConcept } from '@models/serviceConcepts/common.model';
import { Input } from '@components/Atoms/ui/input';
import { format } from 'date-fns';
import { generateUUIDV4 } from '@utils/helpers/GenerateUUID';
import checkoutSessionService from '@services/checkoutSession';

type ConceptProps = {
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
    concept: IServiceConcept;
};

const Booking = ({ isOpen, onOpenChange, concept }: ConceptProps) => {

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data: any) => {
        const selectedDate = new Date(data.date);
        const formattedDate = format(selectedDate, 'dd/MM/yyyy');
        const id = generateUUIDV4();
        const bookingData = {
            sessionData: {
                conceptId: data.conceptId,
                date: formattedDate,
                time: data.time
            }
        };

        console.log('Booking data before sending:', bookingData);
        const res = await checkoutSessionService.createCheckSession(id, userId, bookingData)
        console.log('Booking data:', res);
    };

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
                            <Input
                                type='hidden'
                                value={concept?.id}
                                {...register('conceptId', {
                                    required: 'Vui lòng chọn gói dịch vụ',
                                })}
                            />

                            <div className="w-full">
                                <Label htmlFor="service">Gói dịch vụ</Label>
                                <div className='w-full rounded-md mt-1'>
                                    <Input
                                        value={concept?.name}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className='w-full'>
                                <Label htmlFor="date">Ngày đặt lịch</Label>
                                <div className=" w-full rounded-md mt-1">
                                    <CustomDatePicker
                                        value={watch('date')}
                                        onChange={(date) => setValue('date', date)}
                                    />
                                    <Input
                                        type="hidden"
                                        {...register('date', {
                                            required: 'Vui lòng chọn ngày',
                                            valueAsDate: true,
                                            validate: (value) => {
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                const selected = new Date(value);
                                                selected.setHours(0, 0, 0, 0);

                                                if (selected < today) {
                                                    return 'Ngày đặt lịch không được trước ngày hôm nay';
                                                }
                                                return true;
                                            },
                                        })}
                                    />
                                </div>
                                {errors.date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.date?.message?.toString()}</p>
                                )}
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
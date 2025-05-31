'use client'

import Input from '@components/Atoms/Input'
import TextArea from '@components/Atoms/TextArea'
import { useFormBooking, useSetFormBooking } from '@stores/checkout/selectors'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

type FormValues = {
    fullname: string
    email: string
    phone: string
    notes: string
}

const Infomation = () => {

    /**
     * React Hook Form setup
     */
    const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            fullname: '',
            email: '',
            phone: '',
            notes: '',
        },
    });
    //-----------------------------End-----------------------------//

    /**
     * Zustand store for booking form
     */
    const setBookingForm = useSetFormBooking();
    const formBooking = useFormBooking();

    useEffect(() => {
        const subscription = watch((values) => {
            setBookingForm({
                ...formBooking,
                ...values,
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, setBookingForm, formBooking]);
    //-----------------------------End-----------------------------//



    return (
        <form className="space-y-6" onSubmit={handleSubmit(() => { })}>
            <div>
                <label htmlFor="fullname" className="block text-sm font-medium mb-2">
                    Họ và tên
                </label>
                <Controller
                    name="fullname"
                    control={control}
                    render={({ field }) => (
                        <Input id="fullname" {...field} />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                    </label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input id="email" type="email" {...field} />
                        )}
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Số điện thoại
                    </label>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input id="phone" {...field} />
                        )}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    Ghi chú
                </label>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <TextArea id="notes" placeholder="Ghi chú thêm (nếu có)" rows={4} {...field} />
                    )}
                />
            </div>
        </form>
    )
}

export default Infomation
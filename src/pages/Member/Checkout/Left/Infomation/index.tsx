'use client'

import Input from '@components/Atoms/Input'
import TextArea from '@components/Atoms/TextArea'
import { useFormBooking, useSetFormBooking } from '@stores/checkout/selectors'
import { useUser } from '@stores/user/selectors'
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

type FormValues = {
    fullname: string
    email: string
    phone: string
    user_note: string
}

const Infomation = () => {
    const userStore = useUser();

    /**
     * React Hook Form setup
     */
    const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            fullname: userStore?.fullName || '',
            email: userStore?.email || '',
            phone: userStore?.phoneNumber?.toString() || '',
            user_note: '',
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
                    name="user_note"
                    control={control}
                    render={({ field }) => (
                        <TextArea id="user_note" placeholder="Ghi chú thêm (nếu có)" rows={4} {...field} />
                    )}
                />
            </div>
        </form>
    )
}

export default Infomation
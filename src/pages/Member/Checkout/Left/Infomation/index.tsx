'use client'

import Input from '@components/Atoms/Input'
import TextArea from '@components/Atoms/TextArea'
import { IBookingFormRequest } from '@models/booking/request.model'
import { useFormBooking, useSetFormBooking, useSetIsValidStep } from '@stores/checkout/selectors'
import { useUser } from '@stores/user/selectors'
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

type FormValues = {
    fullName: string
    email: string
    phone: string
    userNote: string
}

const Infomation = () => {
    /**
     * Define variables zustand store
     */
    const userStore = useUser();
    const setBookingForm = useSetFormBooking();
    const formBooking = useFormBooking();
    const setIsValidStep = useSetIsValidStep();
    //-----------------------------End-----------------------------//

    /**
     * React Hook Form setup
     */
    const { control, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm<FormValues>({
        mode: 'onChange', // Validate on every change to update `isValid`
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            userNote: '',
        },
    });

    /**
     * Effect 1: Initialize or reset the form when user data or booking context changes.
     */
    useEffect(() => {
        const newValues = {
            fullName: formBooking.fullName || userStore?.fullName || '',
            email: formBooking.email || userStore?.email || '',
            phone: formBooking.phone || userStore?.phoneNumber?.toString() || '',
            userNote: formBooking.userNote || '',
        };
        reset(newValues);
    }, [userStore?.id, formBooking.serviceConceptId, reset]); // Only re-run when essential data changes

    /**
     * Effect 2: Watch for form changes and sync with Zustand store.
     */
    useEffect(() => {
        const subscription = watch((values) => {
            setBookingForm({ ...formBooking, ...values } as IBookingFormRequest);
        });
        return () => subscription.unsubscribe();
    }, [watch, setBookingForm]);

    /**
     * Effect 3: React to validity changes and update step status.
     */
    useEffect(() => {
        setIsValidStep(2, isValid);
    }, [isValid, setIsValidStep]);
    //-----------------------------End-----------------------------//

    return (
        // Added noValidate to prevent default browser validation
        <form className="space-y-6" onSubmit={handleSubmit(() => { })} noValidate>
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Họ và tên
                </label>
                <Controller
                    name="fullName"
                    control={control}
                    rules={{ required: 'Vui lòng nhập họ và tên' }}
                    render={({ field }) => (
                        <Input id="fullName" {...field} className={errors.fullName ? 'border-red-500' : ''} />
                    )}
                />
                {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                    </label>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Vui lòng nhập email',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Địa chỉ email không hợp lệ',
                            },
                        }}
                        render={({ field }) => (
                            <Input id="email" type="email" {...field} className={errors.email ? 'border-red-500' : ''} />
                        )}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Số điện thoại
                    </label>
                    <Controller
                        name="phone"
                        control={control}
                        rules={{
                            required: 'Vui lòng nhập số điện thoại',
                            pattern: {
                                value: /^[0-9]{10,11}$/, // Example: 10 to 11 digits
                                message: 'Số điện thoại không hợp lệ',
                            },
                        }}
                        render={({ field }) => (
                            <Input id="phone" {...field} className={errors.phone ? 'border-red-500' : ''} />
                        )}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="userNote" className="block text-sm font-medium mb-2">
                    Ghi chú
                </label>
                <Controller
                    name="userNote"
                    control={control}
                    render={({ field }) => (
                        <TextArea id="userNote" placeholder="Ghi chú thêm (nếu có)" rows={4} {...field} />
                    )}
                />
            </div>
        </form>
    )
}

export default Infomation;
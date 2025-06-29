'use client'

import Input from '@components/Atoms/Input'
import TextArea from '@components/Atoms/TextArea'
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
    //-----------------------------End-----------------------------//

    /**
     * React Hook Form setup
     */
    const { control, handleSubmit, watch, reset } = useForm<FormValues>({
        defaultValues: {
            fullName: formBooking.fullName || userStore?.fullName || '',
            email: formBooking.email || userStore?.email || '',
            phone: formBooking.phone || userStore?.phoneNumber?.toString() || '',
            userNote: formBooking.userNote || '',
        },
    });

    /**
     * Zustand store for booking form
     */
    const setIsValidStep = useSetIsValidStep();

    useEffect(() => {
        const newValues = {
            fullName: formBooking.fullName || userStore?.fullName || '',
            email: formBooking.email || userStore?.email || '',
            phone: formBooking.phone || userStore?.phoneNumber?.toString() || '',
            userNote: formBooking.userNote || '',
        };
        
        reset(newValues);

        const isValid = newValues.fullName.trim() !== '' &&
            newValues.email.trim() !== '' &&
            newValues.phone.trim() !== '';
        
        setIsValidStep(2, isValid);

        setBookingForm({
            ...formBooking,
            ...newValues,
        });

        const subscription = watch((values: Partial<FormValues>) => {
            const watchIsValid = (values.fullName?.trim() ?? '') !== '' &&
                (values.email?.trim() ?? '') !== '' &&
                (values.phone?.trim() ?? '') !== '';

            setIsValidStep(2, watchIsValid);

            setBookingForm({
                ...formBooking,
                ...values,
            });
        });

        return () => subscription.unsubscribe();
    }, [userStore?.id, formBooking.serviceConceptId, reset, watch, setIsValidStep, setBookingForm]); // Only re-run when essential data changes
    //-----------------------------End-----------------------------//

    return (
        <form className="space-y-6" onSubmit={handleSubmit(() => { })}>
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Họ và tên
                </label>
                <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                        <Input id="fullName" {...field} />
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
                    <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                        Số điện thoại
                    </label>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input id="phoneNumber" {...field} />
                        )}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
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

export default Infomation
'use client'

import Button from '@components/Atoms/Button'
import BookingService from '@services/booking'
import { useCheckoutStep, useFormBooking, useIsValidStep, useSetCheckoutStep } from '@stores/checkout/selectors'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const FooterAction = () => {
    /**
     * Definne variables
     */
    const router = useRouter()

    //------------------------------End-----------------------------//

    /**
     * Zustand store for checkout step
     */
    const currentStep = useCheckoutStep()
    const setCurrentStep = useSetCheckoutStep()
    //------------------------------End-----------------------------//

    /**
     * Zustand store for validation of steps
     */
    const isValidStep = useIsValidStep()
    const isDisabled = isValidStep[currentStep]
    //------------------------------End-----------------------------//


    /**
     * Handle form booking data
     */
    const formBooking = useFormBooking()
    const { handleSubmit } = useForm({
        defaultValues: formBooking,
        mode: 'onChange',
    })

    const onSubmit = async () => {
        const { userId, serviceConceptId, ...spread } = formBooking
        try {
            const res = await BookingService.createBooking(
                userId,
                serviceConceptId,
                spread,
            ) as any

            console.log('Booking response:', res);

            if (res.statusCode === 201) {
                router.replace(res.data.paymentLink)
            } else {
                toast.error(res.message || 'Đặt lịch không thành công, vui lòng thử lại sau.')
            }
        } catch (error) {
            console.error('Error creating booking:', error)
            return
        }
    }
    //------------------------------End-----------------------------//

    const handleBack = () => {
        if (currentStep === 1) router.back()
        else setCurrentStep(currentStep - 1)
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mt-8">
                <button type="button" onClick={handleBack} className='cursor-pointer ml-2'>Quay lại</button>
                <Button
                    className="bg-primary hover:bg-[#e8935d]"
                    disabled={!isDisabled}
                    type={currentStep === 3 ? 'submit' : 'button'}
                    onClick={
                        currentStep < 3
                            ? (e) => {
                                e.preventDefault();
                                setCurrentStep(currentStep + 1);
                            }
                            : undefined
                    }
                >
                    {currentStep < 3 ? 'Tiếp tục' : 'Thanh toán'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    )
}

export default FooterAction
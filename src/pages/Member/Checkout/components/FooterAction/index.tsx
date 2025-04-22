'use client'

import Button from '@components/Atoms/Button'
import { useCheckoutStep, useSetCheckoutStep } from '@stores/checkout/selectors'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const FooterAction = () => {
    const router = useRouter()

    const currentStep = useCheckoutStep()

    const setCurrentStep = useSetCheckoutStep()
    const handleBack = () => {
        if (currentStep === 1) router.back()
        else setCurrentStep(currentStep - 1)
    }

    return (
        <>
            <div className="flex justify-between items-center mt-8">
                <button onClick={handleBack} className='cursor-pointer ml-2'>Quay lại</button>
                <Button className="bg-primary hover:bg-[#e8935d]"
                    onClick={() => {
                        if (currentStep < 3) setCurrentStep(currentStep + 1)
                    }}
                >
                    {currentStep < 3 ? 'Tiếp tục' : 'Thanh toán'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </>
    )
}

export default FooterAction
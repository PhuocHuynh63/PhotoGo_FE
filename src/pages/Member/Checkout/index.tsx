'use client'

import { useCheckoutStep } from '@stores/checkout/selector'
import React from 'react'
import Method from './Left/Method'
import Infomation from './Left/Infomation'

const CheckoutPage = () => {
    const currentStep = useCheckoutStep()

    return (
        <>
            {currentStep === 1 ?
                <Method />
                : currentStep === 2 ?
                    <Infomation />
                    : <div>
                        cc Tina
                    </div>
            }
        </>
    )
}

export default CheckoutPage
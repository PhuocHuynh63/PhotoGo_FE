'use client'

import { useCheckoutStep } from '@stores/checkout/selectors'
import React from 'react'
import Method from './Left/Method'
import Infomation from './Left/Infomation'
import Confirm from './Left/Confirm'

const CheckoutPage = () => {
    const currentStep = useCheckoutStep()

    return (
        <>
            {currentStep === 1 ?
                <Method />
                : currentStep === 2 ?
                    <Infomation />
                    : <div>
                        <Confirm />
                    </div>
            }
        </>
    )
}

export default CheckoutPage
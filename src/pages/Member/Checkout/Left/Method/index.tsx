'use client'

import React from 'react'
import Deposit from '../../components/Deposit'
import PaymentMethod from '../../components/PaymentMethod'

const Method = () => {

    return (
        <>
            {/* Deposit */}
            <Deposit />

            {/* Payment Method Selection */}
            <PaymentMethod />
        </>
    )
}

export default Method
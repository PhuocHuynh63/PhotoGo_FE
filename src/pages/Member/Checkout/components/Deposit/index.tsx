'use client'

import { useCheckoutDeposit, useSetCheckoutDeposit } from '@stores/checkout/selectors'
import React from 'react'

const Deposit = () => {
    const depositOptions = [30, 50, 70, 100]
    const selectedDeposit = useCheckoutDeposit()
    const setDeposit = useSetCheckoutDeposit()

    return (
        <>
            {/* STEP 1 - Phương thức thanh toán */}
            {/* Deposit Selection */}
            <div className="mb-6">
                <h3 className="font-medium mb-4">Chọn mức đặt cọc</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {depositOptions.map((value: number) => (
                        <div
                            key={value}
                            className={`relative cursor-pointer transition-all duration-200 rounded-lg p-4 text-center border 
                                        ${selectedDeposit === value
                                    ? 'border-2 border-primary bg-primary-opacity'
                                    : 'border-gray-200 hover:border-primary/50'}
                                        `}
                            onClick={() => setDeposit(value)}
                        >
                            {selectedDeposit === value && (
                                <div className="absolute -top-2 right-4 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                    Đã chọn
                                </div>
                            )}
                            <div className={`text-2xl font-bold ${selectedDeposit === value ? 'text-primary' : 'text-gray-500'}`}>
                                {value}%
                            </div>
                            <div className="text-sm text-gray-500">{value === 100 ? 'Thanh toán đủ' : 'Đặt cọc'}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Deposit
'use client'

import { useFormBooking, useCheckoutSelectedMethod, useCheckoutSelectMethod, useSetFormBooking } from '@stores/checkout/selectors'
import React, { useEffect } from 'react'

const PaymentMethod = () => {
    /**
     * Payment Method Selection Component
     */
    const selectedMethod = useCheckoutSelectedMethod()
    const setSelectMethod = useCheckoutSelectMethod()
    //-----------------------------End-----------------------------//


    /**
     * Set booking form when checkout session is available
     */
    const setBookingForm = useSetFormBooking();
    const formBooking = useFormBooking();
    useEffect(() => {
        setBookingForm({
            ...formBooking,
            method: (selectedMethod as "payos"),
        });
    }, []);
    //----------------------End----------------------//

    return (
        <>
            <div className="mb-6">
                <h3 className="font-medium mb-4">Chọn phương thức thanh toán</h3>
                <div defaultValue="card">
                    <div className="border rounded-lg p-4 mb-3">
                        <div className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all duration-200 ${selectedMethod === 'payos' ? 'border-primary bg-[#fffaf5]' : 'border-gray-200'
                            }`} onClick={() => setSelectMethod('payos')}>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors duration-150 
                                                        ${selectedMethod === 'payos' ? 'border-primary' : 'border-gray-400'}
                                                          hover:border-primary
                                                    `}
                                >
                                    {selectedMethod === 'payos' && (
                                        <div className="h-2 w-2 bg-primary rounded-full" />
                                    )}
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <img src="https://payos.vn/docs/img/logo.svg" alt="PayOS Logo" className='h-10 w-10 mr-2' />
                                    <div>
                                        <div className="font-medium">PayOS</div>
                                        <div className="text-sm text-gray-500">Thanh toán qua ví PayOS</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div></>
    )
}

export default PaymentMethod
'use client'

import Button from '@components/Atoms/Button'
import { useCheckoutDeposit } from '@stores/checkout/selector'
import { ArrowRight, CreditCard, Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Deposit from '../../components/Deposit'

const CheckoutPage = () => {

    const router = useRouter()


    //#region Handle Select Method
    const [selectedMethod, setSelectedMethod] = useState<string | null>('payos')
    const handleSelect = (method: string) => {
        setSelectedMethod(prev => (prev === method ? null : method))
    }
    //#endregion


    //#region Handle Select Deposit
    const selectedDeposit = useCheckoutDeposit()
    //#endregion


    //#region Handle Step Form
    const [currentStep, setCurrentStep] = useState<number>(1)
    const handleBackStepForm = () => {
        if (currentStep === 1) router.back()
        else setCurrentStep(prev => prev - 1)
    }
    //#endregion



    const handleBack = () => {
        if (currentStep === 1) router.back()
        else setCurrentStep(prev => prev - 1)
    }
    return (
        <>
            {/* Left Column - Payment Options */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border h-fit">
                {/* Header */}
                <div className="bg-gradient-secondary p-6 rounded-t-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <CreditCard className='text-primary' />
                        <h2 className="font-medium text-lg">Phương thức thanh toán</h2>
                    </div>
                    <p className="text-gray-500 text-sm">Chọn phương thức thanh toán phù hợp với bạn</p>
                </div>


                {/* Step Checkout */}
                <div className="p-6">
                    <div>
                        {/* Step Indicator */}
                        <div className="grid grid-cols-3 mb-6 text-center font-medium text-sm">
                            <div className={`${currentStep === 1 ? 'bg-primary text-white' : 'text-gray-500'} py-2 rounded-lg`}>
                                Phương thức
                            </div>
                            <div className={`${currentStep === 2 ? 'bg-primary text-white' : 'text-gray-500'} py-2 rounded-lg`}>
                                Thông tin
                            </div>
                            <div className={`${currentStep === 3 ? 'bg-primary text-white' : 'text-gray-500'} py-2 rounded-lg`}>
                                Xác nhận
                            </div>
                        </div>

                        <div>
                            <div className="bg-primary-opacity border border-primary/20 rounded-lg p-4 mb-6">
                                <div className="flex gap-2">
                                    <Info className="h-5 w-5 text-" />
                                    <p className="text-sm">
                                        <span className="font-medium">Chính sách đặt lịch:</span> Khi đặt dịch vụ studio, bạn cần đặt cọc
                                        trước một phần để xác nhận lịch hẹn. Số tiền còn lại sẽ được thanh toán vào ngày thực hiện dịch vụ.
                                    </p>
                                </div>
                            </div>

                            {/* Deposit */}
                            <Deposit />

                            {/* Payment Method Selection */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-4">Chọn phương thức thanh toán</h3>
                                <div defaultValue="card">
                                    <div className="border rounded-lg p-4 mb-3">
                                        <div className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all duration-200 ${selectedMethod === 'payos' ? 'border-primary bg-[#fffaf5]' : 'border-gray-200'
                                            }`} onClick={() => handleSelect('payos')}>
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
                            </div>

                            {/* <div className="bg-[#fff9f2] rounded-lg p-5 border border-primary/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        <h3 className="font-medium">Thông tin thẻ</h3>
                                    </div>
                                    <div className="text-xs text-primary flex items-center gap-1">
                                        <Shield className="h-4 w-4" />
                                        Bảo mật
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Số thẻ</label>
                                        <Input placeholder="1234 5678 9012 3456" className="bg-white" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500 mb-1 block">Ngày hết hạn</label>
                                            <Input placeholder="MM/YY" className="bg-white" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500 mb-1 block">CVV</label>
                                            <Input placeholder="123" className="bg-white" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500 mb-1 block">Tên chủ thẻ</label>
                                        <Input placeholder="NGUYỄN VĂN A" className="bg-white" />
                                    </div>
                                </div>
                            </div> */}
                            {/* STEP 2 - Thông tin thanh toán */}
                            {currentStep === 2 && (
                                <div className="text-sm text-gray-600">
                                    <p>Thông tin thanh toán sẽ hiển thị tại đây (tuỳ vào phương thức thanh toán đã chọn).</p>
                                    <p className="mt-2 italic">Bạn có thể hiển thị QR PayOS hoặc redirect sang cổng thanh toán.</p>
                                </div>
                            )}

                            {/* STEP 3 - Xác nhận */}
                            {currentStep === 3 && (
                                <div className="text-sm text-gray-600">
                                    <p>Xác nhận lại đặt cọc: <strong>{selectedDeposit}%</strong></p>
                                    <p>Phương thức: <strong>{selectedMethod}</strong></p>
                                    <p className="mt-2 text-green-600 font-medium">Bạn đã sẵn sàng để thanh toán.</p>
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="flex justify-between items-center mt-8">
                                <button onClick={handleBack} className='cursor-pointer ml-2'>Quay lại</button>
                                <Button className="bg-primary hover:bg-[#e8935d]"
                                    onClick={() => {
                                        if (currentStep < 3) setCurrentStep(prev => prev + 1)
                                    }}
                                >
                                    {currentStep < 3 ? 'Tiếp tục' : 'Thanh toán'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default CheckoutPage
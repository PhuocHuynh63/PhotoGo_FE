'use client'

import Button from '@components/Atoms/Button'
import { ArrowRight, CreditCard, Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const CheckoutPage = () => {

    const router = useRouter()
    const handleBack = () => {
        router.back()
    }

    //#region Handle Select Method
    const [selectedMethod, setSelectedMethod] = useState<string | null>('payos')
    const handleSelect = (method: string) => {
        setSelectedMethod(prev => (prev === method ? null : method))
    }
    //#endregion


    const [selectedDeposit, setSelectedDeposit] = useState<number>(30)
    const depositOptions = [30, 50, 70, 100]
    const handleSelectDeposit = (deposit: number) => {
        setSelectedDeposit(deposit)
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
                        <div className="grid grid-cols-3 mb-6">
                            <div
                                className="data-[state=active]:bg-[#f0a06a] data-[state=active]:text-white"
                            >
                                Phương thức
                            </div>
                            <div>Thông tin</div>
                            <div>Xác nhận</div>
                        </div>

                        <div>
                            <div className="bg-primary-opacity border border-[#f0a06a]/20 rounded-lg p-4 mb-6">
                                <div className="flex gap-2">
                                    <Info className="h-5 w-5 text-" />
                                    <p className="text-sm">
                                        <span className="font-medium">Chính sách đặt lịch:</span> Khi đặt dịch vụ studio, bạn cần đặt cọc
                                        trước một phần để xác nhận lịch hẹn. Số tiền còn lại sẽ được thanh toán vào ngày thực hiện dịch vụ.
                                    </p>
                                </div>
                            </div>

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
                                                    : 'border-gray-200 hover:border-[#f0a06a]/50'}
                                        `}
                                            onClick={() => handleSelectDeposit(value)}
                                        >
                                            {selectedDeposit === value && (
                                                <div className="absolute -top-2 right-4 bg-[#f0a06a] text-white text-xs px-2 py-0.5 rounded-full">
                                                    Đã chọn
                                                </div>
                                            )}
                                            <div className={`text-2xl font-bold ${selectedDeposit === value ? 'text-[#f0a06a]' : 'text-gray-500'}`}>
                                                {value}%
                                            </div>
                                            <div className="text-sm text-gray-500">{value === 100 ? 'Thanh toán đủ' : 'Đặt cọc'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-4">Chọn phương thức thanh toán</h3>
                                <div defaultValue="card">
                                    <div className="border rounded-lg p-4 mb-3">
                                        <div className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all duration-200 ${selectedMethod === 'payos' ? 'border-[#f0a06a] bg-[#fffaf5]' : 'border-gray-200'
                                            }`} onClick={() => handleSelect('payos')}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors duration-150 
                                                        ${selectedMethod === 'payos' ? 'border-[#f0a06a]' : 'border-gray-400'}
                                                          hover:border-[#f0a06a]
                                                    `}
                                                >
                                                    {selectedMethod === 'payos' && (
                                                        <div className="h-2 w-2 bg-[#f0a06a] rounded-full" />
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

                            {/* <div className="bg-[#fff9f2] rounded-lg p-5 border border-[#f0a06a]/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-[#f0a06a]" />
                                        <h3 className="font-medium">Thông tin thẻ</h3>
                                    </div>
                                    <div className="text-xs text-[#f0a06a] flex items-center gap-1">
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
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <Link href={''} onClick={handleBack} className='ml-2'>Quay lại</Link>
                        <Button className="bg-[#f0a06a] hover:bg-[#e8935d]">
                            Tiếp tục
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default CheckoutPage
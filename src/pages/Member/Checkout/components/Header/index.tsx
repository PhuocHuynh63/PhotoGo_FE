'use client'

import { CreditCard } from 'lucide-react'
import React from 'react'

const Header = () => {
    return (
        <>
            <div className="bg-gradient-secondary p-6 rounded-t-xl">
                <div className="flex items-center gap-2 mb-3">
                    <CreditCard className='text-primary' />
                    <h2 className="font-medium text-lg">Phương thức thanh toán</h2>
                </div>
                <p className="text-gray-500 text-sm">Chọn phương thức thanh toán phù hợp với bạn</p>
            </div>
            </>
    )
}

export default Header
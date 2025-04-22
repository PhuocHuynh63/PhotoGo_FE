'use client'

import React, { useState } from 'react'

const SelectionPricing = () => {
    const [selected, setSelected] = useState<'month' | 'session'>('month')

    return (
        <div className='flex justify-center items-center gap-4 mb-10'>
            <div className='relative border border-gray-300 rounded-md flex items-center w-fit px-1 py-1'>
                <div
                    className={`absolute top-0 bottom-0 w-1/2 rounded-md bg-primary transition-all duration-300 ease-in-out
                        ${selected === 'month' ? 'left-0' : 'left-1/2'}
                    `}
                />

                <button
                    className={`relative z-10 px-5 py-2.5 rounded-md transition-colors duration-300 font-semibold
                        ${selected === 'month' ? 'text-white' : 'text-description'}
                    `}
                    onClick={() => setSelected('month')}
                >
                    Theo tháng
                </button>
                <button
                    className={`relative z-10 px-5 py-2.5 rounded-md transition-colors duration-300 font-semibold
                        ${selected === 'session' ? 'text-white' : 'text-description'}
                    `}
                    onClick={() => setSelected('session')}
                >
                    Theo buổi
                </button>
            </div>
        </div>
    )
}

export default SelectionPricing
// src/app/pricing/components/SelectionPricing.tsx
'use client'
import React from 'react'

// Định nghĩa kiểu cho props
type SelectionPricingProps = {
    selected: 'month' | 'session';
    setSelected: (value: 'month' | 'session') => void;
}

const SelectionPricing = ({ selected, setSelected }: SelectionPricingProps) => {
    return (
        <div className='flex justify-center items-center gap-4 mb-12'>
            <div className='relative bg-slate-200 rounded-full flex items-center w-fit p-1'>
                <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-primary shadow-md transition-all duration-300 ease-in-out
                        ${selected === 'month' ? 'left-1' : 'left-[calc(50%+1px)]'}
                    `}
                />
                <button
                    className={`relative cursor-pointer z-10 px-6 py-2.5 rounded-full transition-colors duration-300 font-semibold text-sm
                        ${selected === 'month' ? 'text-white' : 'text-slate-700 hover:text-slate-900'}
                    `}
                    onClick={() => setSelected('month')}
                >
                    Theo tháng
                </button>
                <button
                    className={`relative cursor-pointer z-10 px-6 py-2.5 rounded-full transition-colors duration-300 font-semibold text-sm
                        ${selected === 'session' ? 'text-white' : 'text-slate-700 hover:text-slate-900'}
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
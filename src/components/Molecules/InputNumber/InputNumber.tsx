'use client'
import React, { useState } from 'react';

const InputNumber: React.FC = () => {
    const [value, setValue] = useState(1);

    const handleIncrement = () => {
        setValue(value + 1);
    };

    const handleDecrement = () => {
        if (value > 0) {
            setValue(value - 1);
        }
    };

    return (
        <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
            <button className='border rounded-l-md p-2 h-10 items-center justify-center flex' onClick={handleDecrement}>-</button>
            <input
                className='border-y border-r border-l h-10'
                type="number"
                value={value}
                readOnly
                style={{ width: '40px', textAlign: 'center' }}
            />
            <button className='border rounded-r-md p-2 h-10 items-center ' onClick={handleIncrement}>+</button>
        </div>
    );
};

export default InputNumber;

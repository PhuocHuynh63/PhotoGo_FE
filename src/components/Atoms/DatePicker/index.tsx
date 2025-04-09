'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CustomDatePicker({
    value,
    onChange,
    placeholder = 'Chọn ngày',
}: {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="relative w-full">
            <DatePicker
                selected={value}
                onChange={onChange}
                placeholderText={placeholder}
                dateFormat="dd/MM/yyyy"
                minDate={today}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                    const allowedKeys = [
                        'Tab', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete',
                        ...'0123456789/'.split('')
                    ];
                    if (!allowedKeys.includes(e.key)) {
                        e.preventDefault();
                    }
                }}
            />
        </div>
    );
}

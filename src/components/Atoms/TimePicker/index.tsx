'use client';

import React from 'react';

export default function TimePicker({
    value,
    onChange,
    placeholder = 'Chọn giờ',
}: {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
}) {
    return (
        <div className="relative w-full">
            {/* <DatePicker
                selected={value}
                onChange={onChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Giờ"
                dateFormat="HH:mm"
                placeholderText={placeholder}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            /> */}
        </div>
    );
}

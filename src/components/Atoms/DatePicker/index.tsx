'use client';

import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function CustomDatePicker({
    value,
    onChange,
    placeholder = 'Chọn ngày',
}: {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);
    const [today, setToday] = useState<Date | null>(null);

    useEffect(() => {
        setToday(new Date());
    }, []);

    const handleDateSelect = (date: Date | undefined) => {
        onChange(date || null);
        setOpen(false);
    };

    const formatDate = (date: Date | null) => {
        return date ? date.toLocaleDateString('vi-VN') : '';
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                readOnly
                className="w-full px-4 py-2 border rounded-md cursor-pointer bg-white"
                placeholder={placeholder}
                value={formatDate(value)}
                onClick={() => setOpen(!open)}
            />
            {open && today && (
                <div className="absolute p-2 z-10 mt-2 bg-white border rounded-md shadow-md">
                    <DayPicker
                        mode="single"
                        selected={value || undefined}
                        onSelect={handleDateSelect}
                        disabled={{ before: today }}
                        defaultMonth={value || today}
                        classNames={{
                            selected: 'text-white rounded-full',
                            today: 'bg-gray-100 text-blue-600 rounded-full',
                        }}
                        modifiersStyles={{
                            selected: {
                                backgroundColor: 'var(--bg-orange)',
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
}

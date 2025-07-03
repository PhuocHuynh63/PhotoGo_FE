'use client';

import { Calendar } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
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
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setToday(new Date());
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const handleDateSelect = (date: Date | undefined) => {
        onChange(date || null);
        setOpen(false);
    };

    const formatDate = (date: Date | null) => {
        return date ? date.toLocaleDateString('vi-VN') : '';
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <input
                type="text"
                readOnly
                className="w-full px-4 py-2 border rounded-md cursor-pointer bg-white"
                placeholder={placeholder}
                value={formatDate(value)}
                onClick={() => setOpen(!open)}
            />
            <span className="absolute right-4 top-2 cursor-pointer" onClick={() => setOpen(!open)}>
                <Calendar className='text-gray-600' />
            </span>
            <AnimatePresence>
                {open && today && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: -10,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: -10,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut",
                        }}
                        className="absolute p-2 z-10 mt-2 bg-white border rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                        <DayPicker
                            mode="single"
                            selected={value || undefined}
                            onSelect={handleDateSelect}
                            captionLayout="dropdown"
                            startMonth={new Date(2024, 6)}
                            disabled={{ before: today }}
                            defaultMonth={value || today}
                            classNames={{
                                selected: "selected",
                                chevron: `fill-amber-500`
                            }}
                            modifiersStyles={{
                                selected: {
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'white',
                                    borderRadius: '100%',
                                },
                                today: {
                                    color: 'blue',
                                    borderRadius: '100%',
                                    backgroundColor: 'var(--bg-primary-opacity)',
                                },
                            }}
                        />
                        <button
                            type="button"
                            className="mt-2 w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition cursor-pointer"
                            onClick={() => {
                                if (today) {
                                    onChange(today);
                                    setOpen(false);
                                }
                            }}
                        >
                            Hôm nay
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

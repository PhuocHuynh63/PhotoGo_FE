'use client';

import { Calendar } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-day-picker/dist/style.css';

interface CustomDatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    dayPickerProps?: Partial<DayPickerProps>;
}

export default function CustomDatePicker({
    value,
    onChange,
    placeholder = 'Chọn ngày',
    dayPickerProps = {},
}: CustomDatePickerProps) {
    const [open, setOpen] = useState(false);
    const [today, setToday] = useState<Date | null>(null);
    const [popupPosition, setPopupPosition] = useState<'left' | 'right'>('right');
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

    // Handlers for each mode
    const handleSingleSelect: import('react-day-picker').OnSelectHandler<Date | undefined> = (date) => {
        onChange(date || null);
        setOpen(false);
    };
    const handleMultipleSelect: import('react-day-picker').OnSelectHandler<Date[] | undefined> = (dates) => {
        // For multiple, you may want to pass the last selected date or the array
        // Here, we pass the last date or null
        if (Array.isArray(dates) && dates.length > 0) {
            onChange(dates[dates.length - 1]);
        } else {
            onChange(null);
        }
        setOpen(false);
    };
    const handleRangeSelect: import('react-day-picker').OnSelectHandler<import('react-day-picker').DateRange | undefined> = (range) => {
        // For range, you may want to pass the 'to' date or the full range
        // Here, we pass the 'to' date if exists, else 'from', else null
        if (range && range.to) {
            onChange(range.to);
        } else if (range && range.from) {
            onChange(range.from);
        } else {
            onChange(null);
        }
        setOpen(false);
    };

    const formatDate = (date: Date | null) => {
        return date ? date.toLocaleDateString('vi-VN') : '';
    };

    // Default values for other props
    const defaultCaptionLayout = 'dropdown' as const;
    const defaultDayPickerProps = {
        captionLayout: defaultCaptionLayout,
        startMonth: new Date(2024, 6),
        classNames: {
            selected: 'selected',
            chevron: 'fill-amber-500',
        },
        modifiersStyles: {
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
        },
    };

    // Determine mode and render DayPicker with correct props
    const mode = dayPickerProps?.mode ?? 'single';
    let dayPickerNode: React.ReactNode = null;
    if (mode === 'single') {
        const singleProps = dayPickerProps as Partial<import('react-day-picker').PropsSingle>;
        const { selected, ...restDayPickerProps } = singleProps;
        const selectedDate = selected ?? (value instanceof Date ? value : undefined);
        dayPickerNode = (
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleSingleSelect}
                disabled={dayPickerProps?.disabled ?? (today ? { before: today } : undefined)}
                defaultMonth={dayPickerProps?.defaultMonth ?? (value instanceof Date ? value : today ?? undefined)}
                {...defaultDayPickerProps}
                {...restDayPickerProps}
            />
        );
    } else if (mode === 'multiple') {
        const multiProps = dayPickerProps as Partial<import('react-day-picker').PropsMulti>;
        const { selected, ...restDayPickerProps } = multiProps;
        dayPickerNode = (
            <DayPicker
                mode="multiple"
                selected={selected}
                onSelect={handleMultipleSelect}
                disabled={dayPickerProps?.disabled ?? (today ? { before: today } : undefined)}
                defaultMonth={dayPickerProps?.defaultMonth ?? (today ?? undefined)}
                {...defaultDayPickerProps}
                {...restDayPickerProps}
            />
        );
    } else if (mode === 'range') {
        const rangeProps = dayPickerProps as Partial<import('react-day-picker').PropsRange>;
        const { selected, ...restDayPickerProps } = rangeProps;
        dayPickerNode = (
            <DayPicker
                mode="range"
                selected={selected}
                onSelect={handleRangeSelect}
                disabled={dayPickerProps?.disabled ?? (today ? { before: today } : undefined)}
                defaultMonth={dayPickerProps?.defaultMonth ?? (today ?? undefined)}
                {...defaultDayPickerProps}
                {...restDayPickerProps}
            />
        );
    }

    const handleOpen = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.left < window.innerWidth / 2) {
                setPopupPosition('left');
            } else {
                setPopupPosition('right');
            }
        }
        setOpen(true);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <input
                type="text"
                readOnly
                className="w-full px-4 py-2 border rounded-md cursor-pointer bg-white"
                placeholder={placeholder}
                value={formatDate(value)}
                onClick={handleOpen}
            />
            <span className="absolute right-4 top-2 cursor-pointer" onClick={handleOpen}>
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
                        className={`absolute z-50 mt-2 bg-white border rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 max-w-xs w-[320px] ${popupPosition === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'}`}
                        style={{ minWidth: 240 }}
                    >
                        {dayPickerNode}
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

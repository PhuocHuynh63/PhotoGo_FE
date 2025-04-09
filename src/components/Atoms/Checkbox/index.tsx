'use client';
import React from 'react';

export default function Checkbox({ label, checked, onChange, ...props }: ICOMPONENTS.CheckboxProps) {
    return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                {...props}
                className="accent-primary w-5 h-5"
            />
            <span>{label}</span>
        </label>
    );
}

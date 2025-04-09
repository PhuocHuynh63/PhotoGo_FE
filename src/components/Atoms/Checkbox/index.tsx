'use client';
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Checkbox({ label, ...props }: CheckboxProps) {
    return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...props} className="accent-primary w-5 h-5" />
            <span>{label}</span>
        </label>
    );
}

'use client';
import React from 'react';



export default function RadioButtonGroup({ name, options, value, onChange }: ICOMPONENTS.RadioButtonGroupProps) {
    return (
        <div className="flex flex-col gap-2">
            {options.map(opt => (
                <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={() => onChange(opt.value)}
                        className="accent-primary w-5 h-5"
                    />
                    <span>{opt.label}</span>
                </label>
            ))}
        </div>
    );
}

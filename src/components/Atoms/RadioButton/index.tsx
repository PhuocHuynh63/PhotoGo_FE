'use client';
import * as RadioGroup from '@radix-ui/react-radio-group';
import React from 'react';

export default function RadioButtonGroup({ name, options, value, onChange }: ICOMPONENTS.RadioButtonGroupProps) {
    return (
        <RadioGroup.Root
            className="flex flex-col gap-2"
            value={value}
            onValueChange={onChange}
            name={name}
        >
            {options.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroup.Item
                        value={opt.value}
                        className="w-4 h-4 rounded-full border border-gray-400 cursor-pointer
                                   data-[state=checked]:bg-[#ffffff] 
                                   data-[state=checked]:border-[#F6AC69] 
                                   flex items-center justify-center transition-colors"
                    >
                        <RadioGroup.Indicator className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </RadioGroup.Item>
                    <label className="cursor-pointer">{opt.label}</label>
                </div>
            ))}
        </RadioGroup.Root>
    );
}

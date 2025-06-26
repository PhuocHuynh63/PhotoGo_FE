'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import LucideIcon from '../LucideIcon';
import * as Icons from 'lucide-react';
import { useEffect } from 'react';

export default function Select({
    label,
    labelClassName,
    className,
    width,
    height,
    fontSize,
    style,
    options,
    placeHolder,
    value,
    selectIcon,
    onValueChange,
}: ICOMPONENTS.SelectProps) {
    const customStyle: React.CSSProperties = {
        width,
        fontSize,
        ...style,
    };

    // Auto-select first option if no placeholder and no value is set
    useEffect(() => {
        if (!placeHolder && !value && options?.length > 0 && onValueChange) {
            onValueChange(String(options[0].value));
        }
    }, [placeHolder, value, options, onValueChange]);

    const selectedOption = options.find(opt => String(opt.value) === value);

    return (
        <div className="flex flex-col gap-1" style={customStyle}>
            {label && <label className={`text-sm font-medium ${labelClassName ?? ''}`}>{label}</label>}

            <RadixSelect.Root value={String(value)} onValueChange={onValueChange}>
                <RadixSelect.Trigger
                    className={`inline-flex items-center justify-between px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${height} ${className ?? ''}`}
                >
                    {!value && <LucideIcon name={selectIcon as keyof typeof Icons} />}
                    <div className="flex items-center gap-2">
                        {selectedOption?.icon && (
                            <LucideIcon name={selectedOption.icon as keyof typeof Icons} className="w-4 h-4" />
                        )}

                        <RadixSelect.Value placeholder={placeHolder} />
                    </div>

                    <RadixSelect.Icon className="ml-2">
                        <ChevronDown size={16} />
                    </RadixSelect.Icon>
                </RadixSelect.Trigger>

                <RadixSelect.Content position="popper" sideOffset={8} align="start" className="z-[120] max-w-[95vw] sm:max-w-[400px] rounded-md border bg-white shadow-lg p-0">
                    <RadixSelect.Viewport className="p-1 z-40 ">
                        {options.map((opt, index) => (
                            <RadixSelect.Item
                                key={index}
                                value={String(opt.value)}
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-100 cursor-pointer text-sm"
                            >
                                {opt.icon && (
                                    <LucideIcon name={opt.icon as keyof typeof Icons} className="w-4 h-4" />
                                )}
                                <RadixSelect.ItemText>{opt.label ?? opt.value}</RadixSelect.ItemText>
                                <RadixSelect.ItemIndicator className="ml-auto">
                                    <Check className="w-4 h-4 text-blue-600" />
                                </RadixSelect.ItemIndicator>
                            </RadixSelect.Item>
                        ))}
                    </RadixSelect.Viewport>
                </RadixSelect.Content>
            </RadixSelect.Root>
        </div>
    );
}

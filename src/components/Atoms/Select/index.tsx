'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check, Search } from 'lucide-react';
import LucideIcon from '../LucideIcon';
import * as Icons from 'lucide-react';
import { useEffect, useState } from 'react';

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
    searchable = false,
}: ICOMPONENTS.SelectProps & { searchable?: boolean }) {
    const customStyle: React.CSSProperties = {
        width,
        fontSize,
        ...style,
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Auto-select first option if no placeholder and no value is set
    useEffect(() => {
        if (!placeHolder && !value && options?.length > 0 && onValueChange) {
            onValueChange(String(options[0].value));
        }
    }, [placeHolder, value, options, onValueChange]);

    const selectedOption = options.find(opt => String(opt.value) === value);

    // Filter options based on search term
    const filteredOptions = searchable && searchTerm
        ? options.filter(opt =>
            opt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(opt.value).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    return (
        <div className="flex flex-col gap-1" style={customStyle}>
            {label && <label className={`text-sm font-medium ${labelClassName ?? ''}`}>{label}</label>}

            <RadixSelect.Root
                value={String(value)}
                onValueChange={onValueChange}
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <RadixSelect.Trigger
                    className={`inline-flex items-center justify-between px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${height} ${className ?? ''}`}
                >
                    {!value && <LucideIcon name={selectIcon as keyof typeof Icons} />}
                    <div className="flex items-center gap-2 overflow-hidden">
                        {selectedOption?.icon && (
                            <LucideIcon name={selectedOption.icon as keyof typeof Icons} className="w-4 h-4" />
                        )}
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {selectedOption ? selectedOption.name : placeHolder}
                        </span>
                    </div>

                    <RadixSelect.Icon className="ml-2">
                        <ChevronDown size={16} />
                    </RadixSelect.Icon>
                </RadixSelect.Trigger>


                <RadixSelect.Content
                    position="popper"
                    sideOffset={8}
                    align="start"
                    className="z-[120] w-[var(--radix-select-trigger-width)] max-w-[95vw] sm:max-w-[400px] rounded-md border bg-white shadow-lg p-0"
                >
                    <RadixSelect.Viewport className="p-1 z-40 max-h-[300px] overflow-y-auto">
                        {/* Search input for searchable dropdowns */}
                        {searchable && (
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options list */}
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt, index) => (
                                <RadixSelect.Item value={String(opt.value)} key={index} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                    {opt.icon && <LucideIcon name={opt.icon as keyof typeof Icons} />}
                                    <RadixSelect.ItemText>{opt.name}</RadixSelect.ItemText>
                                    <RadixSelect.ItemIndicator className="ml-auto">
                                        <Check className="w-4 h-4 text-blue-600" />
                                    </RadixSelect.ItemIndicator>
                                </RadixSelect.Item>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                {searchTerm ? 'Không tìm thấy kết quả' : 'Không có dữ liệu'}
                            </div>
                        )}

                    </RadixSelect.Viewport>
                </RadixSelect.Content>
            </RadixSelect.Root>
        </div>
    );
}

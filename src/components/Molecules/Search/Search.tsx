'use client';

import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import LucideIcon from '@components/Atoms/LucideIcon';

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};



const Search: React.FC<ICOMPONENTS.SearchProps> = ({
    placeholder = 'Tìm kiếm...',
    value = '',
    onChange,
    onSearch,
    className = '',
    debounceTime = 700,
    totalResults,
    searchWidth = '300px'
}) => {
    const [searchTerm, setSearchTerm] = useState<string>(value);
    const debouncedSearchTerm = useDebounce(searchTerm, debounceTime);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        if (debouncedSearchTerm !== value) {
            onChange?.(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, value, onChange]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        if (onSearch && searchTerm !== '') {
            onSearch(searchTerm);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={`relative ${className}`} style={{ width: searchWidth }}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-4 py-2 pr-10 text-sm border border-grey bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
            />
            <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:opacity-70"
                onClick={handleSearch}
            >
                <LucideIcon name="Search" />
            </div>
            {totalResults !== undefined && searchTerm && (
                <div className="mt-1 text-xs text-description">
                    {totalResults} kết quả được tìm thấy
                </div>
            )}
        </div>
    );
};

export default Search;
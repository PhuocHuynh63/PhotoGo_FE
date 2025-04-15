"use client"

import { cn } from "@helpers/CN"
import { Input, type InputProps } from "@atoms/Input/Input"
import { Search } from "lucide-react"

interface SearchInputProps extends Omit<InputProps, "type"> {
    placeholder?: string
    onSearch?: (value: string) => void
}

export function SearchInput({ placeholder = "Tìm kiếm...", onSearch, className, ...props }: SearchInputProps) {
    return (
        <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                className={cn("pl-8", className)}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                {...props}
            />
        </div>
    )
}

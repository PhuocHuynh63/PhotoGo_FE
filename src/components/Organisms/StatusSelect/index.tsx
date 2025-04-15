"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@atoms/Select/Select"
import { BadgeWrapper } from "@/components/Atoms/Badge/BadgeWrapper"
import type { ReactNode } from "react"

interface StatusOption {
    value: string
    label?: string
    icon?: ReactNode
    className?: string
  }
  
  interface StatusSelectProps {
    value: string
    onValueChange: (value: string) => void
    options: StatusOption[]
    placeholder?: string
    className?: string
    showAsBadge?: boolean // New prop to choose between badge or text
  }
  
  export function StatusSelect({
    value,
    onValueChange,
    options,
    placeholder = "Chọn trạng thái",
    className,
    showAsBadge = true, // Default to showing as badge
  }: StatusSelectProps) {
    const selectedOption = options.find((option) => option.value === value)
  
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder}>
            {value && selectedOption && showAsBadge ? (
              // Use BadgeWrapper if showAsBadge is true
              <BadgeWrapper
                type="status"
                value={value as "active" | "inactive"} 
                className="text-xs"
              />
            ) : (
              // Otherwise, just show the text
              selectedOption?.label || selectedOption?.value
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label || option.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
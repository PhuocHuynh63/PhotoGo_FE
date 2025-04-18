"use client"

import type React from "react"

import { useState, useCallback, type ReactNode } from "react"
import { Input } from "@components/Atoms/ui/input"
import { Button } from "@components/Atoms/ui/button"
import { Search, SlidersHorizontal, X } from "lucide-react"

export interface FilterConfig {
  id: string
  type: "select" | "date-range" | "slider" | "text" | "checkbox" | "radio" | "custom"
  label: string
  component: ReactNode
}

interface GenericFilterSectionProps<T> {
  searchPlaceholder?: string
  filterConfigs: FilterConfig[]
  onFilterChange: (values: T) => void
  isLoading?: boolean
  defaultValues?: T
  showFiltersInitially?: boolean
}

export function GenericFilterSection<T>({
  searchPlaceholder = "Tìm kiếm...",
  filterConfigs,
  onFilterChange,
  isLoading = false,
  defaultValues = {} as T,
  showFiltersInitially = true,
}: GenericFilterSectionProps<T>) {
  const [showFilters, setShowFilters] = useState(showFiltersInitially)
  const [filters, setFilters] = useState<T>(defaultValues as T)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleApplyFilters = useCallback(() => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        search: searchTerm,
      } as T)
    }
  }, [filters, searchTerm, onFilterChange])

  const handleReset = useCallback(() => {
    setFilters(defaultValues as T)
    setSearchTerm("")
    if (onFilterChange) {
      onFilterChange(defaultValues as T)
    }
  }, [defaultValues, onFilterChange])

  const toggleShowFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleShowFilters} className="whitespace-nowrap" disabled={isLoading}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          </Button>
          <Button onClick={handleApplyFilters} className="whitespace-nowrap" disabled={isLoading}>
            Áp dụng
          </Button>
          <Button variant="outline" onClick={handleReset} className="whitespace-nowrap" disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        </div>
      </div>

      {showFilters && filterConfigs.length > 0 && (
        <div className="border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filterConfigs.map((config) => (
              <div key={config.id} className="space-y-2">
                <h3 className="font-medium">{config.label}</h3>
                {config.component}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

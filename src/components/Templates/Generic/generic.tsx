"use client"

import { useState, useCallback, type ReactNode } from "react"
import { DataTable, type Column } from "@components/Organisms/Table/data-table"
import { useToast } from "@components/Atoms/ui/use-toast"

interface GenericManagementProps<T, F> {
  title: string
  data: T[]
  columns: Column<T>[]
  filterComponent: ReactNode
  onFilterChange: (values: F) => void
  keyExtractor: (item: T) => string | number
  emptyStateMessage?: string
  statsComponent?: ReactNode
}

export function GenericManagement<T, F>({
  title,
  data,
  columns,
  filterComponent,
  onFilterChange,
  keyExtractor,
  emptyStateMessage = "Không có dữ liệu",
  statsComponent,
}: GenericManagementProps<T, F>) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Xử lý khi chuyển trang
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    setIsLoading(true)

    // Giả lập gọi API
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  return (
    <div className=" mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>

      {filterComponent}

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        keyExtractor={keyExtractor}
        pagination={{
          currentPage,
          totalPages: 10,
          totalItems: 100,
          onPageChange: handlePageChange,
        }}
        emptyState={
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground">{emptyStateMessage}</p>
          </div>
        }
      />
    </div>
  )
}

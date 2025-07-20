"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/Atoms/ui/table"
import { Button } from "@components/Atoms/ui/button"
import { Skeleton } from "@components/Atoms/ui/skeleton"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@utils/helpers/CN"

export interface Column<T> {
  id: string
  header: React.ReactNode
  cell: (item: T, index: number) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  skeletonRows?: number
  keyExtractor: (item: T, index: number) => string | number
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
    itemsPerPage?: number
  }
  emptyState?: React.ReactNode
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
  keyExtractor,
  pagination,
  emptyState,
}: DataTableProps<T>) {
  return (
    <div className="space-y-6">
      <div className="rounded-md border shadow-md bg-white dark:bg-gray-950 overflow-hidden">
        <Table className="border-collapse">
          <TableHeader className="bg-blue-50 dark:bg-blue-950">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    "font-semibold text-blue-700 dark:text-blue-200 py-4 border-b-2 border-blue-200 dark:border-blue-800",
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Hiển thị skeleton khi đang loading
              Array(skeletonRows)
                .fill(0)
                .map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`} className="border-b border-gray-300 dark:border-gray-700">
                    {columns.map((column, colIndex) => (
                      <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
                        <Skeleton className="h-5 w-full max-w-[120px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : data?.length > 0 ? (
              data?.map((item, index) => (
                <TableRow
                  key={keyExtractor(item, index)}
                  className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  {columns.map((column) => (
                    <TableCell key={`${keyExtractor(item, index)}-${column.id}`} className={cn("py-3", column.className)}>
                      {column.cell(item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-24 text-center">
                  {emptyState || "Không có dữ liệu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị{" "}
            <strong>
              {isLoading
                ? "-"
                : data?.length > 0
                  ? (pagination.currentPage - 1) * (pagination.itemsPerPage || 10) + 1
                  : 0}
            </strong>{" "}
            đến{" "}
            <strong>
              {isLoading
                ? "-"
                : data?.length > 0
                  ? Math.min(pagination.currentPage * (pagination.itemsPerPage || 10), pagination.totalItems)
                  : 0}
            </strong>{" "}
            trong tổng số <strong>{isLoading ? "-" : pagination.totalItems}</strong> mục
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage === 1 || isLoading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Trang <strong>{pagination.currentPage}</strong> / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages || isLoading}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"

import { Camera } from "lucide-react"
import { Card, CardContent } from "@components/Atoms/ui/card"
import DateStatsCard from "@components/Organisms/ProofInvoiceCard/DateStatsCard"
import ProofFilterTabs from "@components/Organisms/ProofInvoiceCard/ProofFilterTabs"
import ProofInvoiceCard from "@components/Organisms/ProofInvoiceCard/ProofInvoiceCard"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"
import { useAlbumData, type Invoice } from "@utils/hooks/useAlbumData"

// Remove duplicate interfaces since they're now in the hook
interface ProofManagementPageProps {
    invoices?: Invoice[]
    locations?: {
        id: string;
        address: string;
        ward: string;
        district: string;
        city: string;
        province: string;
        [key: string]: string | undefined;
    }[]
}

function toLocalDateString(date: Date) {
    // Lấy dd/mm/yyyy theo local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
}

// Function to convert yyyy-mm-dd to dd/mm/yyyy
function convertDateFormat(dateStr: string) {
    if (dateStr.includes('/')) return dateStr; // Already in dd/mm/yyyy format
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

export default function ProofManagementPage({ invoices = [], locations = [] }: ProofManagementPageProps) {

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [filter, setFilter] = useState<"tất cả" | "chưa upload" | "đã upload">("tất cả")
    const [selectedLocationId, setSelectedLocationId] = useState<string>(locations?.[0]?.id || "")
    const [uploadModal, setUploadModal] = useState<{ open: boolean; invoice?: Invoice }>({ open: false })

    const selectedDateStr = selectedDate ? toLocalDateString(selectedDate) : ""

    // Use custom hook for album data
    // API expects DD/MM/YYYY format, so use selectedDateStr directly
    // Only fetch data if we have valid locationId and date
    const {
        data: albumData,
        loading: isLoading,
        error,
        refetch: fetchAlbumData
    } = useAlbumData(selectedLocationId, selectedDateStr, filter)

    // Separate hook for stats (always get all data)
    const {
        data: allAlbumData,
        refetch: fetchAllAlbumData
    } = useAlbumData(selectedLocationId, selectedDateStr, "tất cả")
    // Use API data instead of props
    const currentInvoices = Array.isArray(albumData) && albumData.length > 0 ? albumData : (Array.isArray(invoices) ? invoices : [])

    const filteredInvoices = Array.isArray(currentInvoices) ? currentInvoices.filter((invoice) => {
        if (!invoice?.booking?.date) return false
        const bookingDate = convertDateFormat(invoice.booking.date)
        const matchesDate = bookingDate === selectedDateStr
        const matchesFilter =
            filter === "tất cả" ||
            (filter === "chưa upload" && invoice.needsProof) ||
            (filter === "đã upload" && !invoice.needsProof)
        return matchesDate && matchesFilter
    }) : []

    // Use allAlbumData for accurate stats (not filtered by current tab)
    const allInvoices = Array.isArray(allAlbumData) && allAlbumData.length > 0 ? allAlbumData : (Array.isArray(invoices) ? invoices : [])
    const needsProofCount = Array.isArray(allInvoices) ? allInvoices.filter((inv) => inv?.booking?.date && convertDateFormat(inv.booking.date) === selectedDateStr && inv?.needsProof).length : 0
    const hasProofCount = Array.isArray(allInvoices) ? allInvoices.filter((inv) => inv?.booking?.date && convertDateFormat(inv.booking.date) === selectedDateStr && !inv?.needsProof).length : 0

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const formatTime = (timeStr: string) => {
        return timeStr.substring(0, 5) // "14:00:00" -> "14:00"
    }

    const formatDateTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr)
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "đã xác nhận":
                return "bg-blue-100 text-blue-800"
            case "đã hoàn thành":
                return "bg-green-100 text-green-800"
            case "đã hủy":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "đã thanh toán đầy đủ":
                return "bg-green-100 text-green-800"
            case "đã thanh toán một phần":
                return "bg-yellow-100 text-yellow-800"
            case "chưa thanh toán":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bằng chứng thực hiện</h2>
                    <p className="text-muted-foreground">Upload ảnh bằng chứng cho các đơn booking đã hoàn thành</p>

                </div>
                <div>
                    {/* location selector from locations*/}
                    <Select
                        value={selectedLocationId}
                        onValueChange={(value) => {
                            setSelectedLocationId(value)
                        }}
                        disabled={!Array.isArray(locations) || locations.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={
                                !Array.isArray(locations) || locations.length === 0 
                                    ? "Không có địa điểm" 
                                    : "Chọn địa điểm"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.isArray(locations) && locations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                    {location.address}, {location.ward}, {location.district}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>

            {/* Date selector và stats */}
            <DateStatsCard
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                needsProofCount={needsProofCount}
                hasProofCount={hasProofCount}
                formatDate={formatDate}
                selectedDateStr={selectedDateStr}
            />

            {/* Error message */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <p className="text-red-600 text-sm">
                            ⚠️ {error}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Filter tabs */}
            <ProofFilterTabs
                filter={filter}
                setFilter={setFilter}
                needsProofCount={needsProofCount}
                hasProofCount={hasProofCount}
            >
                {!selectedLocationId ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Chưa chọn địa điểm</h3>
                            <p className="text-muted-foreground text-center">
                                Vui lòng chọn một địa điểm để xem danh sách booking
                            </p>
                        </CardContent>
                    </Card>
                ) : isLoading ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                            <h3 className="text-lg font-medium mb-2">Đang tải dữ liệu...</h3>
                            <p className="text-muted-foreground text-center">
                                Vui lòng chờ trong giây lát
                            </p>
                        </CardContent>
                    </Card>
                ) : filteredInvoices?.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Không có đơn booking nào</h3>
                            <p className="text-muted-foreground text-center">
                                {filter === "chưa upload"
                                    ? "Không có đơn nào cần upload bằng chứng trong ngày này"
                                    : filter === "đã upload"
                                        ? "Không có đơn nào đã có bằng chứng trong ngày này"
                                        : "Không có đơn booking nào trong ngày này"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredInvoices.map((invoice) => (
                            <ProofInvoiceCard
                                key={invoice.id}
                                invoice={invoice}
                                uploadModal={uploadModal}
                                setUploadModal={setUploadModal}
                                formatCurrency={formatCurrency}
                                formatDate={formatDate}
                                formatTime={formatTime}
                                formatDateTime={formatDateTime}
                                getStatusColor={getStatusColor}
                                getPaymentStatusColor={getPaymentStatusColor}
                                onUploadSuccess={() => {
                                    fetchAlbumData()
                                    fetchAllAlbumData()
                                }}
                            />
                        ))}
                    </div>
                )}
            </ProofFilterTabs>
        </div>
    )
}

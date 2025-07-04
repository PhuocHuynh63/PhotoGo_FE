"use client"

import type React from "react"

import { useState } from "react"

import { Camera } from "lucide-react"
import { Card, CardContent } from "@components/Atoms/ui/card"
import DateStatsCard from "@pages/Vendor/Components/Proof/DateStatsCard"
import ProofFilterTabs from "@pages/Vendor/Components/Proof/ProofFilterTabs"
import ProofInvoiceCard from "@pages/Vendor/Components/Proof/ProofInvoiceCard"

interface Booking {
    id: string
    userId: string
    locationId: string
    serviceConceptId: string
    date: string
    time?: string
    status?: string
    sourceType?: string
    sourceId?: string | null
    depositAmount?: string | number
    depositType?: string
    userNote?: string
    fullName?: string
    phone?: string
    email?: string
    code?: string
    priorityScore?: string
    created_at?: string
    updated_at?: string
}

interface Payment {
    id: string
    invoiceId: string
    amount: string
    paymentOSId: string
    paymentMethod: string
    status: string
    type: string
    transactionId: string
    description: string
    createdAt: string
    updatedAt: string
}

interface Invoice {
    id: string
    bookingId: string
    voucherId?: string | null
    originalPrice: number
    discountAmount: number
    discountedPrice: number
    taxAmount: number
    feeAmount: number
    payablePrice: number
    depositAmount: number
    remainingAmount: number
    paidAmount: number
    status: string
    issuedAt: string
    updatedAt: string
    booking: Booking
    payments: Payment[]
    vendorId: string
    // Proof fields
    proofImages?: string[]
    proofNotes?: string
    proofUploadedAt?: string
    needsProof?: boolean
}

interface ProofManagementPageProps {
    invoices?: Invoice[]
}

function toLocalDateString(date: Date) {
    // Lấy yyyy-mm-dd theo local time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function ProofManagementPage({ invoices = [] }: ProofManagementPageProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [filter, setFilter] = useState<"all" | "needs_proof" | "has_proof">("needs_proof")
    const [uploadModal, setUploadModal] = useState<{ open: boolean; invoice?: Invoice }>({ open: false })
    const selectedDateStr = selectedDate ? toLocalDateString(selectedDate) : ""
    const filteredInvoices = (invoices || []).filter((invoice) => {
        const bookingDate = invoice.booking.date
        const matchesDate = bookingDate === selectedDateStr
        const matchesFilter =
            filter === "all" || (filter === "needs_proof" && invoice.needsProof) || (filter === "has_proof" && !invoice.needsProof)
        return matchesDate && matchesFilter
    })

    const needsProofCount = (invoices || []).filter((inv) => inv.booking.date === selectedDateStr && inv.needsProof).length
    const hasProofCount = (invoices || []).filter((inv) => inv.booking.date === selectedDateStr && !inv.needsProof).length

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
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

            {/* Filter tabs */}
            <ProofFilterTabs
                filter={filter}
                setFilter={setFilter}
                needsProofCount={needsProofCount}
                hasProofCount={hasProofCount}
            >
                {filteredInvoices.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Không có đơn booking nào</h3>
                            <p className="text-muted-foreground text-center">
                                {filter === "needs_proof"
                                    ? "Không có đơn nào cần upload bằng chứng trong ngày này"
                                    : filter === "has_proof"
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
                            />
                        ))}
                    </div>
                )}
            </ProofFilterTabs>
        </div>
    )
}

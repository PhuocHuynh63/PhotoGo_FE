"use client"

import { useState } from "react"
import VoucherTypeSelector from "../VoucherSelectorDialog"
import AddVoucherDialog from "../AddVoucherDialog"
import { VOUCHER } from "@constants/voucher"

interface CreateVoucherFlowProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CreateVoucherFlow({ open, onClose, onSuccess }: CreateVoucherFlowProps) {
    const [showSelector, setShowSelector] = useState(true)
    const [selectedVoucherType, setSelectedVoucherType] = useState<{
        discount_type: "phần trăm" | "cố định"
        voucher_type: "điểm" | "tiền"
    } | null>(null)

    const handleVoucherTypeSelect = (discountType: "phần trăm" | "cố định", voucherType: "điểm" | "tiền") => {
        setSelectedVoucherType({ discount_type: discountType, voucher_type: voucherType })
        setShowSelector(false)
    }

    const handleClose = () => {
        setShowSelector(true)
        setSelectedVoucherType(null)
        onClose()
    }

    const handleSuccess = () => {
        setShowSelector(true)
        setSelectedVoucherType(null)
        onSuccess()
    }

    const handleBackToSelector = () => {
        setShowSelector(true)
        setSelectedVoucherType(null)
    }

    // Map từ VoucherSelectorDialog sang constants
    const mapToConstants = () => {
        if (!selectedVoucherType) return {}

        const discountTypeMap = {
            "phần trăm": VOUCHER.DISCOUNT_TYPE.PERCENT,
            "cố định": VOUCHER.DISCOUNT_TYPE.AMOUNT,
        }

        const voucherTypeMap = {
            "điểm": VOUCHER.TYPE.POINT,
            "tiền": VOUCHER.TYPE.CAMPAIGN,
        }

        return {
            discount_type: discountTypeMap[selectedVoucherType.discount_type],
            type: voucherTypeMap[selectedVoucherType.voucher_type],
        }
    }

    return (
        <>
            {/* Voucher Type Selector */}
            <VoucherTypeSelector
                open={open && showSelector}
                onOpenChange={(open) => {
                    if (!open) handleClose()
                }}
                onSelect={handleVoucherTypeSelect}
            />

            {/* Add Voucher Dialog */}
            {selectedVoucherType && (
                <AddVoucherDialog
                    open={open && !showSelector}
                    onClose={handleClose}
                    onSuccess={handleSuccess}
                    initialData={mapToConstants()}
                    onBack={handleBackToSelector}
                />
            )}
        </>
    )
} 
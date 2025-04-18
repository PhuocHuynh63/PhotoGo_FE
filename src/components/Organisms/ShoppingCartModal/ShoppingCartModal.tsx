"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingBag, Clock, Calendar } from "lucide-react"
import Button from "@components/Atoms/Button"
import { Separator } from "@components/Atoms/Seperator/Seperator"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"
import SingleCheckbox from "@components/Atoms/Checkbox/SingleCheckBox"

export default function ShoppingCartModal({ isOpen, onClose, cart }: ICOMPONENTS.ShoppingCartModalProps) {
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [selectedVendor, setSelectedVendor] = useState<number | null>(null)

    const vendorGroups: ICOMPONENTS.VendorGroup[] = cart.reduce((groups: ICOMPONENTS.VendorGroup[], item) => {
        const existingGroup = groups.find((group) => group.vendor_id === item.vendor_id)
        if (existingGroup) {
            existingGroup.items.push(item)
        } else {
            groups.push({ vendor_id: item.vendor_id, items: [item] })
        }
        return groups
    }, [])

    useEffect(() => {
        if (!isOpen) {
            setSelectedItems([])
            setSelectedVendor(null)
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleItemSelect = (itemId: number, vendorId: number) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId))

            const vendorItemsStillSelected = cart
                .filter((item) => item.vendor_id === vendorId && selectedItems.includes(item.id))
                .filter((item) => item.id !== itemId)

            if (vendorItemsStillSelected.length === 0) {
                setSelectedVendor(null)
            }
        } else {
            setSelectedItems([...selectedItems, itemId])

            if (selectedVendor === null) {
                setSelectedVendor(vendorId)
            }
        }
    }

    const handleSelectAllVendor = (vendorId: number, vendorItems: ICOMPONENTS.CartItem[]) => {
        const vendorItemIds = vendorItems.map((item) => item.id)
        const allSelected = vendorItemIds.every((id) => selectedItems.includes(id))

        if (allSelected) {
            setSelectedItems(selectedItems.filter((id) => !vendorItemIds.includes(id)))
            if (selectedItems.length === vendorItemIds.length) {
                setSelectedVendor(null)
            }
        } else {
            const newSelectedItems = [...selectedItems.filter((id) => !vendorItemIds.includes(id)), ...vendorItemIds]
            setSelectedItems(newSelectedItems)
            setSelectedVendor(vendorId)
        }
    }

    const isVendorSelectable = (vendorId: number) => {
        return selectedVendor === null || selectedVendor === vendorId
    }

    const areAllVendorItemsSelected = (vendorItems: ICOMPONENTS.CartItem[]) => {
        return vendorItems.every((item) => selectedItems.includes(item.id))
    }

    const calculateTotal = () => {
        return cart.filter((item) => selectedItems.includes(item.id)).reduce((total, item) => total + item.price, 0)
    }

    const calculateTotalDuration = () => {
        return cart.filter((item) => selectedItems.includes(item.id)).reduce((total, item) => total + item.duration, 0)
    }

    const renderItemDetails = (item: ICOMPONENTS.CartItem) => (
        <div className="flex items-center gap-2">
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{item.booked_date.toLocaleDateString()}</span>
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{item.duration} phút</span>
            </div>
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-xl font-semibold">Giỏ hàng của bạn</h2>
                    <Button icon="CircleX" onClick={onClose}><span className="sr-only">Đóng</span></Button>
                </div>

                <div className="overflow-y-auto p-4 max-h-[60vh]">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">Giỏ hàng của bạn đang trống</p>
                            <p className="text-sm text-muted-foreground mt-1">Thêm một số dịch vụ vào giỏ hàng để xem chúng ở đây.</p>
                            <Button className="mt-6 bg-[#D2B48C] hover:bg-[#C19A6B] text-white" onClick={onClose}>Tiếp tục mua sắm</Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {vendorGroups.map((group) => {
                                const isDisabled = !isVendorSelectable(group.vendor_id)
                                const allSelected = areAllVendorItemsSelected(group.items)

                                return (
                                    <div key={group.vendor_id} className={`border rounded-md overflow-hidden ${isDisabled ? "opacity-50" : ""}`}>
                                        <div className="bg-gray-50 p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <SingleCheckbox
                                                    checked={allSelected}
                                                    onChange={() => !isDisabled && handleSelectAllVendor(group.vendor_id, group.items)}
                                                    disabled={isDisabled && !allSelected}
                                                />
                                                <h3 className="font-medium">Nhà cung cấp {group.vendor_id}</h3>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{group.items.length} dịch vụ</span>
                                        </div>

                                        <div className="divide-y">
                                            {group.items.map((item) => {
                                                const isSelected = selectedItems.includes(item.id)

                                                return (
                                                    <div key={item.id} className="flex items-center gap-4 p-4">
                                                        <SingleCheckbox
                                                            checked={isSelected}
                                                            onChange={() => !isDisabled && handleItemSelect(item.id, item.vendor_id)}
                                                            disabled={isDisabled && !isSelected}
                                                        />
                                                        <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                                                            <Image src={item.img || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between">
                                                            <div className="flex justify-between">
                                                                <div>
                                                                    <h3 className="font-medium">{item.name}</h3>
                                                                    {renderItemDetails(item)}
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-medium">{formatPrice(item.price)}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <>
                        <Separator />
                        <div className="p-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Tổng thời gian:</span>
                                    <span>{calculateTotalDuration()} phút</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Tổng tiền:</span>
                                    <span>{formatPrice(calculateTotal())}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    className="flex-1 bg-[#D2B48C] hover:bg-[#C19A6B] text-white"
                                    onClick={() => console.log("Checkout", selectedItems)}
                                    disabled={selectedItems.length === 0}
                                >
                                    Thanh toán
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-[#D2B48C] text-[#D2B48C] hover:bg-[#F5F5DC] hover:text-[#C19A6B]"
                                    onClick={onClose}
                                >
                                    Tiếp tục mua sắm
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

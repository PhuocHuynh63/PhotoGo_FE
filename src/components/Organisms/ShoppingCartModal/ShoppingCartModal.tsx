"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingBag, Clock, Calendar, Trash2 } from "lucide-react"
import Button from "@components/Atoms/Button"
import { Separator } from "@components/Atoms/Seperator/Seperator"
import { formatPrice } from "@utils/helpers/CurrencyFormat/CurrencyFormat"
import SingleCheckbox from "@components/Atoms/Checkbox/SingleCheckBox"
import { useCart, useRemoveItem, useRemoveItems } from "@stores/cart/selectors"
import toast from "react-hot-toast"
import EnhancedBookingPopup from "@pages/Public/VendorDetail/components/EnhancedBookingPopup"

export default function ShoppingCartModal({ isOpen, onClose, servicePackages }: Omit<ICOMPONENTS.ShoppingCartModalProps, 'cartItems'>) {
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    const [isBulkDelete, setIsBulkDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showBookingPopup, setShowBookingPopup] = useState(false)
    const cart = useCart()
    const cartItems = Array.isArray(cart?.data) ? cart?.data : []
    const removeItem = useRemoveItem()
    const removeItems = useRemoveItems()

    const vendorGroups = cartItems.reduce((groups: ICOMPONENTS.VendorGroup[], item: ICOMPONENTS.CartItem) => {
        const vendorId = item.serviceConcept.servicePackageId;
        const existingGroup = groups.find(group => group.servicePackageId === vendorId);

        if (existingGroup) {
            existingGroup.items.push(item);
        } else {
            groups.push({
                servicePackageId: vendorId,
                items: [item]
            });
        }

        return groups;
    }, []);
    useEffect(() => {
        if (!isOpen) {
            setSelectedItems([])
            setSelectedVendor(null)
        }
    }, [isOpen])

    const getServicePackageName = (servicePackageId: string) => {
        if (!servicePackages?.data || !Array.isArray(servicePackages.data)) {
            return `Gói dịch vụ ${servicePackageId}`;
        }
        const servicePackage = servicePackages.data.find((pkg: { id: string; name: string }) => pkg.id === servicePackageId);
        return servicePackage?.name || `Gói dịch vụ ${servicePackageId}`;
    }

    if (!isOpen) return null

    const handleItemSelect = (itemId: string, vendorId: string) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId))

            const vendorItemsStillSelected = cartItems
                .filter((item: ICOMPONENTS.CartItem) => item.serviceConcept.servicePackageId === vendorId && selectedItems.includes(item.id))
                .filter((item: ICOMPONENTS.CartItem) => item.id !== itemId)

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

    const handleSelectAllVendor = (vendorId: string, vendorItems: ICOMPONENTS.CartItem[]) => {
        const vendorItemIds = vendorItems.map((item: ICOMPONENTS.CartItem) => item.id)
        const allSelected = vendorItemIds.every((id: string) => selectedItems.includes(id))

        if (allSelected) {
            setSelectedItems(selectedItems.filter((id) => !vendorItemIds.includes(id)))
            if (selectedItems.length === vendorItemIds.length) {
                setSelectedVendor(null)
            }
        } else {
            const newSelectedItems = [...selectedItems.filter((id: string) => !vendorItemIds.includes(id)), ...vendorItemIds]
            setSelectedItems(newSelectedItems)
            setSelectedVendor(vendorId)
        }
    }

    const handleDeleteItem = (itemId: string) => {
        setItemToDelete(itemId)
        setIsBulkDelete(false)
        setShowDeleteConfirm(true)
    }

    const handleDeleteSelected = () => {
        setItemToDelete(null)
        setIsBulkDelete(true)
        setShowDeleteConfirm(true)
    }

    const confirmDelete = async () => {
        try {
            setIsDeleting(true)
            const cartId = cart?.data?.[0]?.cartId
            if (!cartId) {
                toast.error("Không tìm thấy giỏ hàng")
                return
            }

            if (isBulkDelete) {
                // Handle bulk delete through API
                await removeItems(selectedItems, cartId)
                setSelectedItems([])
                setSelectedVendor(null)
            } else if (itemToDelete) {
                // Handle single item delete through API
                await removeItem(itemToDelete, cartId)
                // Reset selection states after single item delete
                setSelectedItems([])
                setSelectedVendor(null)
            }
            setShowDeleteConfirm(false)
            setItemToDelete(null)
            setIsBulkDelete(false)
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error("Đã xảy ra lỗi khi xóa sản phẩm")
        } finally {
            setIsDeleting(false)
        }
    }

    const cancelDelete = () => {
        setShowDeleteConfirm(false)
        setItemToDelete(null)
        setIsBulkDelete(false)
    }

    const isVendorSelectable = (vendorId: string) => {
        return selectedVendor === null || selectedVendor === vendorId
    }

    const areAllVendorItemsSelected = (vendorItems: ICOMPONENTS.CartItem[]) => {
        return vendorItems.every((item) => selectedItems.includes(item.id))
    }

    const calculateTotal = () => {
        return cartItems
            .filter((item: ICOMPONENTS.CartItem) => selectedItems.includes(item.id))
            ?.reduce((total: number, item: ICOMPONENTS.CartItem) => {
                const price = parseFloat(item.serviceConcept.price) || 0;
                return total + price;
            }, 0);
    }

    const calculateTotalDuration = () => {
        return cartItems.filter((item: ICOMPONENTS.CartItem) => selectedItems.includes(item.id))?.reduce((total: number, item: ICOMPONENTS.CartItem) => total + item.serviceConcept.duration, 0)
    }

    const renderItemDetails = (item: ICOMPONENTS.CartItem) => (
        <div className="flex items-center gap-2">
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{item.serviceConcept.duration} phút</span>
            </div>
        </div>
    )

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.error("Vui lòng chọn dịch vụ để thanh toán");
            return;
        }

        const selectedItem = cartItems.find((item: ICOMPONENTS.CartItem) => item.id === selectedItems[0]);
        if (!selectedItem) {
            toast.error("Không tìm thấy dịch vụ đã chọn");
            return;
        }

        setShowBookingPopup(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-xl font-semibold">Giỏ hàng của bạn</h2>

                    <div className="flex items-center gap-2">
                        {selectedItems.length > 0 && (
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                                            Đang xóa...
                                        </div>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Xóa đã chọn ({selectedItems.length})
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                        <Button className="bg-none hover:bg-gray-100 shadow-none" iconColor="black" icon="CircleX" onClick={onClose}><span className="sr-only">Đóng</span></Button>
                    </div>
                </div>

                <div className="overflow-y-auto p-4 max-h-[60vh]">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">Giỏ hàng của bạn đang trống</p>
                            <p className="text-sm text-muted-foreground mt-1">Thêm một số dịch vụ vào giỏ hàng để xem chúng ở đây.</p>
                            <Button className="mt-6 bg-primary text-white" onClick={onClose}>Tiếp tục tìm kiếm</Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {vendorGroups.map((group: ICOMPONENTS.VendorGroup) => {
                                const isDisabled = !isVendorSelectable(group.servicePackageId)
                                const allSelected = areAllVendorItemsSelected(group.items)

                                return (
                                    <div key={group.servicePackageId} className={`border rounded-md overflow-hidden ${isDisabled ? "opacity-50" : ""}`}>
                                        <div className="bg-gray-50 p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <SingleCheckbox
                                                    checked={allSelected}
                                                    onChange={() => !isDisabled && handleSelectAllVendor(group.servicePackageId, group.items)}
                                                    disabled={isDisabled && !allSelected}
                                                />
                                                <h3 className="font-medium">Gói <span className="text-primary text-md">{getServicePackageName(group.servicePackageId)}</span></h3>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{group.items.length} dịch vụ</span>
                                        </div>

                                        <div className="divide-y">
                                            {group.items.map((item: ICOMPONENTS.CartItem) => {
                                                const isSelected = selectedItems.includes(item.id)

                                                return (
                                                    <div key={item.id} className="flex items-center gap-4 p-4">
                                                        <SingleCheckbox
                                                            checked={isSelected}
                                                            onChange={() => !isDisabled && handleItemSelect(item.id, item.serviceConcept.servicePackageId)}
                                                            disabled={isDisabled && !isSelected}
                                                        />
                                                        <div
                                                            className="flex flex-1 items-center gap-4 cursor-pointer"
                                                            onClick={() => !isDisabled && handleItemSelect(item.id, item.serviceConcept.servicePackageId)}
                                                        >
                                                            <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                                                                <Image
                                                                    src={item.serviceConcept.images?.[0]?.imageUrl || '/placeholder-image.jpg'}
                                                                    alt={item.serviceConcept.name || 'Service concept image'}
                                                                    fill
                                                                    sizes="80px"
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex flex-1 flex-col justify-between text-lg">
                                                                <div className="flex justify-between">
                                                                    <div>
                                                                        <h3 className="font-medium">{item.serviceConcept.name}</h3>
                                                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.serviceConcept.description}</p>
                                                                        {renderItemDetails(item)}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 justify-center">
                                                                        <div className="font-medium">{formatPrice(parseFloat(item.serviceConcept.price))}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Button
                                                                variant="ghost"
                                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 shadow-none"
                                                                onClick={(e: React.MouseEvent) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteItem(item.id);
                                                                }}
                                                                disabled={isDeleting}
                                                            >
                                                                {isDeleting && itemToDelete === item.id ? (
                                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                                                                ) : (
                                                                    <Trash2 className="h-5 w-5" />
                                                                )}
                                                            </Button>
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

                {cartItems.length > 0 && (
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
                                    className="flex-1 bg-none text-black hover:text-white"
                                    onClick={onClose}
                                >
                                    Tiếp tục mua sắm
                                </Button>
                                <Button
                                    className="flex-1 bg-primary text-white"
                                    onClick={handleCheckout}
                                    disabled={selectedItems.length === 0}
                                >
                                    Thanh toán
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={cancelDelete}>
                    <div
                        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            {isBulkDelete ? 'Xóa các mục đã chọn?' : 'Xóa mục này?'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {isBulkDelete
                                ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} mục đã chọn?`
                                : 'Bạn có chắc chắn muốn xóa mục này khỏi giỏ hàng?'}
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={cancelDelete}
                                className="text-black border-gray-300 hover:bg-gray-50"
                                disabled={isDeleting}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang xóa...
                                    </div>
                                ) : (
                                    'Xóa'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Popup */}
            {showBookingPopup && (
                <EnhancedBookingPopup
                    isOpen={showBookingPopup}
                    onClose={() => setShowBookingPopup(false)}
                    serviceConcept={cartItems.find((item: ICOMPONENTS.CartItem) => item.id === selectedItems[0])?.serviceConcept}
                />
            )}
        </div>
    )
}

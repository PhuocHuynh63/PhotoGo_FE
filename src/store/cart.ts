import { create } from 'zustand'
import { ICartItem } from '@models/cart/common.model'
import http from "@configs/fetch"
import toast from "react-hot-toast"

interface ApiResponse {
    statusCode: number;
    message: string;
    data?: ICartItem[];
}

interface CartStore {
    cart: ICartItem[] | null
    getCart: () => ICartItem[] | null
    setCart: (cart: ICartItem[] | null) => void
    removeItem: (itemId: string, cartId: string) => Promise<void>
    removeItems: (itemIds: string[], cartId: string) => Promise<void>
}

export const useCartStore = create<CartStore>((set, get) => ({
    cart: null,
    setCart: (cart) => set({ cart }),
    getCart: () => get().cart,
    removeItem: async (itemId, cartId) => {
        try {
            const response = await http.delete<ApiResponse>(`/carts/${cartId}/items/${itemId}`, {})
            if (response?.statusCode === 200) {
                set((state) => {
                    if (!state.cart) return state
                    const newCart = state.cart.filter(item => String(item.id) !== String(itemId))
                    return { cart: newCart }
                })
                toast.success("Đã xóa mục khỏi giỏ hàng")
            }
        } catch (error) {
            console.error('Error deleting item:', error)
            toast.error("Có lỗi xảy ra khi xóa mục khỏi giỏ hàng")
        }
    },

    removeItems: async (itemIds, cartId) => {
        try {
            // Delete items one by one through API
            for (const itemId of itemIds) {
                const response = await http.delete<ApiResponse>(`/carts/${cartId}/items/${itemId}`, {})
                if (response?.statusCode === 200) {
                    set((state) => {
                        if (!state.cart) return state
                        return {
                            cart: state.cart.filter(item => !itemIds.includes(String(item.id)))
                        }
                    })
                }
            }
            toast.success("Đã xóa các mục đã chọn khỏi giỏ hàng")
        } catch (error) {
            console.error('Error deleting items:', error)
            toast.error("Có lỗi xảy ra khi xóa các mục khỏi giỏ hàng")
        }
    }
}))
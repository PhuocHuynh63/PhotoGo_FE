import { StateCreator } from 'zustand'
import { ICartItem } from '@models/cart/common.model'
import http from '@configs/fetch'
import toast from 'react-hot-toast'
import { ZUSTAND } from '../../../types/IZustand'

interface ApiResponse {
    statusCode: number
    message: string
    data?: ICartItem[]
}

export const createCartSlice: StateCreator<
    ZUSTAND.ICartState,
    [],
    [],
    ZUSTAND.ICartState
> = (set, get) => ({
    cart: null,
    setCart: (cart) => set({ cart }),
    getCart: () => get().cart,
    addToCart: async (serviceConceptId, cartId, userId) => {
        try {
            const response = await http.post<ApiResponse>(`carts/${userId}/${cartId}/${serviceConceptId}/items`, {})
            if (response?.statusCode === 200 || response?.statusCode === 201) {
                // Refresh cart data or add the new item to existing cart
                if (response.data) {
                    set({ cart: response.data })
                }
                toast.success('Đã thêm vào giỏ hàng')
            }
        } catch (error) {
            console.error('Error adding to cart:', error)
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng')
        }
    },
    removeItem: async (itemId, cartId) => {
        try {
            const response = await http.delete<ApiResponse>(`/carts/${cartId}/items/${itemId}`, {})
            if (response?.statusCode === 200) {
                set((state) => {
                    if (!state.cart) return state
                    const newCart = state.cart.filter(item => String(item.id) !== String(itemId))
                    return { cart: newCart }
                })
                toast.success('Đã xóa mục khỏi giỏ hàng')
            }
        } catch (error) {
            console.error('Error deleting item:', error)
            toast.error('Có lỗi xảy ra khi xóa mục khỏi giỏ hàng')
        }
    },
    removeItems: async (itemIds, cartId) => {
        try {
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
            toast.success('Đã xóa các mục đã chọn khỏi giỏ hàng')
        } catch (error) {
            console.error('Error deleting items:', error)
            toast.error('Có lỗi xảy ra khi xóa các mục khỏi giỏ hàng')
        }
    },
})
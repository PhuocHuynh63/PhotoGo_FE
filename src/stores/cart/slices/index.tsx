import { StateCreator } from 'zustand'
import toast from 'react-hot-toast'
import { ZUSTAND } from '../../../types/IZustand'
import cartService from '@services/cart'
import { ICartResponse } from '@models/cart/response.model'
import { ICartItem } from '@models/cart/common.model'


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
        if (!serviceConceptId || !cartId || !userId) {
            toast.error('Thiếu thông tin cần thiết để thêm vào giỏ hàng')
            return
        }

        try {
            const response = await cartService.addToCart(userId, cartId, serviceConceptId) as ICartResponse
            if (!response) {
                toast.error('Không nhận được phản hồi từ server')
                return
            }

            if (response.statusCode === 200 || response.statusCode === 201) {
                // Fetch updated cart data
                const updatedCartResponse = await cartService.getCartByUserId(userId) as ICartResponse
                if (updatedCartResponse?.statusCode === 200) {
                    set({
                        cart: updatedCartResponse.data
                    });
                    toast.success('Đã thêm vào giỏ hàng')
                    return
                }
            }

            // Handle other status codes
            toast.error(response.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng')
        } catch (error) {
            console.error('Có lỗi xảy ra khi thêm vào giỏ hàng:', error)
            if (error instanceof Error) {
                toast.error(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng')
            } else {
                toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng')
            }
        }
    },
    removeItem: async (itemId, cartId) => {
        try {
            const response = await cartService.removeItem(cartId, itemId) as ICartResponse
            if (response?.statusCode === 200) {
                set((state) => {
                    if (!state.cart) return state
                    return {
                        cart: {
                            ...state.cart,
                            data: state.cart.data.filter((item: ICartItem) => String(item.id) !== String(itemId))
                        }
                    }
                })
                toast.success('Đã xóa mục khỏi giỏ hàng')
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi xóa mục khỏi giỏ hàng:', error)
            toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa mục khỏi giỏ hàng")
        }
    },
    removeItems: async (itemIds, cartId) => {
        try {
            const successfullyRemovedIds: string[] = [];

            for (const itemId of itemIds) {
                try {
                    const response = await cartService.removeItem(cartId, itemId) as ICartResponse;
                    if (response?.statusCode === 200) {
                        successfullyRemovedIds.push(String(itemId));
                    }
                } catch (error) {
                    console.error(`Có lỗi xảy ra khi xóa mục ${itemId}:`, error);
                }
            }

            if (successfullyRemovedIds.length > 0) {
                // Update state once after all operations
                set((state) => {
                    if (!state.cart) return state;
                    return {
                        cart: {
                            ...state.cart,
                            data: state.cart.data.filter((item: ICartItem) =>
                                !successfullyRemovedIds.includes(String(item.id))
                            )
                        }
                    };
                });

                toast.success(
                    successfullyRemovedIds.length === itemIds.length
                        ? "Đã xóa tất cả các mục đã chọn khỏi giỏ hàng"
                        : "Đã xóa một số mục khỏi giỏ hàng"
                );
            }

            if (successfullyRemovedIds.length < itemIds.length) {
                toast.error("Một số mục không thể xóa khỏi giỏ hàng");
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi xóa các mục khỏi giỏ hàng:', error);
            toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa các mục khỏi giỏ hàng");
        }
    },
    fetchCartByUserId: async (userId: string) => {
        if (!userId) return;
        try {
            const response = await cartService.getCartByUserId(userId) as ICartResponse;
            if (response?.statusCode === 200) {
                set({ cart: response.data });
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy giỏ hàng:", error);
        }
    },
})
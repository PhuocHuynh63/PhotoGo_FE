import { useStore } from "@stores"
import { ZUSTAND } from "../../../types/IZustand"

export const useCart = () => useStore((state: ZUSTAND.ICartState) => state.cart)
export const useSetCart = () => useStore((state: ZUSTAND.ICartState) => state.setCart)
export const useRemoveItem = () => useStore((state: ZUSTAND.ICartState) => state.removeItem)
export const useRemoveItems = () => useStore((state: ZUSTAND.ICartState) => state.removeItems)
export const useAddToCart = () => useStore((state: ZUSTAND.ICartState) => state.addToCart)
export const useFetchCartByUserId = () => useStore((state: ZUSTAND.ICartState) => state.fetchCartByUserId)
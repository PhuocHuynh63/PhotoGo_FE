import { useStore } from "@stores"

export const useToken = () => useStore((state: ZUSTAND.ITokenState) => state.token)
export const useSetToken = () => useStore((state: ZUSTAND.ITokenState) => state.setToken)
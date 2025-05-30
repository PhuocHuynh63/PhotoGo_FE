import { useStore } from "@stores"

export const useToken = () => useStore((state: ZUSTAND.IUserState) => state.token)
export const useSetToken = () => useStore((state: ZUSTAND.IUserState) => state.setToken)
export const useSession = () => useStore((state: ZUSTAND.IUserState) => state.session)
export const useSetSession = () => useStore((state: ZUSTAND.IUserState) => state.setSession)
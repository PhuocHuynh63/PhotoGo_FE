import { useStore } from "@stores"
import { ZUSTAND } from "../../../types/IZustand";

export const useSession = () => useStore((state: ZUSTAND.IUserState) => state.session)
export const useSetSession = () => useStore((state: ZUSTAND.IUserState) => state.setSession)

export const useUser = () => useStore((state: ZUSTAND.IUserState) => state.user)
export const useSetUser = () => useStore((state: ZUSTAND.IUserState) => state.setUser)
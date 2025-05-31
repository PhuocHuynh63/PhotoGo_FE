import { useStore } from "@stores"
import { ZUSTAND } from "../../../types/IZustand"

export const useSelectMethod = () => useStore((state: ZUSTAND.ISelectedMethodState) => state.selectedMethod)
export const useSetSelectedMethod = () => useStore((state: ZUSTAND.ISelectedMethodState) => state.setSelectedMethod)
export const useResetSelectedMethod = () => useStore((state: ZUSTAND.ISelectedMethodState) => state.resetSelectedMethod)
import { useStore } from "@stores"
import { ZUSTAND } from "../../../types/IZustand"

export const useVendor = () => useStore((state: ZUSTAND.IVendorState) => state.vendor)
export const useSetVendor = () => useStore((state: ZUSTAND.IVendorState) => state.setVendor)
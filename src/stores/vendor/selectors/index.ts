import { useStore } from "@stores"

export const useVendor = () => useStore((state: ZUSTAND.IVendorState) => state.vendor)
export const useSetVendor = () => useStore((state: ZUSTAND.IVendorState) => state.setVendor)
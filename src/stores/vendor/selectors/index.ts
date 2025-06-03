import { useStore } from "@stores"
import { ZUSTAND } from "../../../types/IZustand"

export const useVendor = () => useStore((state: ZUSTAND.IVendorState) => state.vendor)
export const useSetVendor = () => useStore((state: ZUSTAND.IVendorState) => state.setVendor)

export const useServiceConceptImages = () => useStore((state: ZUSTAND.IVendorState) => state.serviceConceptImages)
export const useSetServiceConceptImages = () => useStore((state: ZUSTAND.IVendorState) => state.setServiceImages)
export const useAddMoreConceptImages = () => useStore((state) => state.addMoreConceptImages);
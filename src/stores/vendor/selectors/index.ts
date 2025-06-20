import { useStore } from "@stores"
import { ZUSTAND } from "../../../types/IZustand"

export const useVendor = () => useStore((state: ZUSTAND.IVendorState) => state.vendor)
export const useSetVendor = () => useStore((state: ZUSTAND.IVendorState) => state.setVendor)

export const useServiceConceptImages = () => useStore((state: ZUSTAND.IVendorState) => state.serviceConceptImages)
export const useSetServiceConceptImages = () => useStore((state: ZUSTAND.IVendorState) => state.setServiceImages)
export const useAddMoreConceptImages = () => useStore((state) => state.addMoreConceptImages);

export const useServicePackage = () => useStore((state: ZUSTAND.IVendorState) => state.servicePackage)
export const useSetServicePackage = () => useStore((state: ZUSTAND.IVendorState) => state.setServicePackage)

export const useServiceConcept = () => useStore((state: ZUSTAND.IVendorState) => state.concept)
export const useSetServiceConcept = () => useStore((state: ZUSTAND.IVendorState) => state.setConcept)

export const useReviews = () => useStore((state: ZUSTAND.IVendorState) => state.reviews)
export const useSetReviews = () => useStore((state: ZUSTAND.IVendorState) => state.setReviews)

export const useAddressLocation = () => useStore((state: ZUSTAND.IVendorState) => state.addressLocation)
export const useSetAddressLocation = () => useStore((state: ZUSTAND.IVendorState) => state.setAddressLocation)
import { useStore } from "@stores"
import { ZUSTAND } from "../../../types/IZustand"

export const useCheckoutDeposit = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectedDepositAmount)
export const useSetCheckoutDeposit = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectDepositAmount)

export const useCheckoutStep = () => useStore((state: ZUSTAND.ICheckoutState) => state.currentStep)
export const useSetCheckoutStep = () => useStore((state: ZUSTAND.ICheckoutState) => state.setStep)

export const useCheckoutSelectedMethod = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectedCheckoutMethod)
export const useCheckoutSelectMethod = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectCheckoutMethod)

export const useSelectedDeposit = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectedDepositAmount)
export const useSelectDeposit = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectDepositAmount)

export const useFormBooking = () => useStore((state: ZUSTAND.ICheckoutState) => state.formBooking)
export const useSetFormBooking = () => useStore((state: ZUSTAND.ICheckoutState) => state.setFormBooking)

export const useIsValidStep = () => useStore((state: ZUSTAND.ICheckoutState) => state.isValidStep)
export const useSetIsValidStep = () => useStore((state: ZUSTAND.ICheckoutState) => state.setIsValidStep)
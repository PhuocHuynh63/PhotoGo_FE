import { useStore } from "@stores"

export const useCheckoutDeposit = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectedDeposit)
export const useSetCheckoutDeposit = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectDeposit)

export const useCheckoutStep = () => useStore((state: ZUSTAND.ICheckoutState) => state.currentStep)
export const useSetCheckoutStep = () => useStore((state: ZUSTAND.ICheckoutState) => state.setStep)

export const useSelectedMethod = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectedMethod)
export const useSelectMethod = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectMethod)

export const useSelectedDeposit = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectedDeposit)
export const useSelectDeposit = () => useStore((state: ZUSTAND.ICheckoutState) => state.selectDeposit)

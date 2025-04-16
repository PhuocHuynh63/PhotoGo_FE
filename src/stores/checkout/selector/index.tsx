import { useStore } from "../../index"

export const useCheckoutDeposit = () => useStore((state: IZUSTAND.CheckoutState) => state.selectedDeposit)
export const useSetCheckoutDeposit = () => useStore((state: IZUSTAND.CheckoutState) => state.selectDeposit)

export const useCheckoutStep = () => useStore((state: IZUSTAND.CheckoutState) => state.currentStep)
export const useSetCheckoutStep = () => useStore((state: IZUSTAND.CheckoutState) => state.setStep)

export const useSelectedMethod = () => useStore((state: IZUSTAND.CheckoutState) => state.selectedMethod)
export const useSelectMethod = () => useStore((state: IZUSTAND.CheckoutState) => state.selectMethod)

export const useSelectedDeposit = () => useStore((state: IZUSTAND.CheckoutState) => state.selectedDeposit)
export const useSelectDeposit = () => useStore((state: IZUSTAND.CheckoutState) => state.selectDeposit)

declare module IZUSTAND {
    export interface CheckoutState {
        currentStep: number
        selectedDeposit: number
        selectedMethod: string | null
        setStep: (step: number) => void
        nextStep: () => void
        prevStep: () => void
        selectDeposit: (percent: number) => void
        selectMethod: (method: string | null) => void
        // reset: () => void
    }
}
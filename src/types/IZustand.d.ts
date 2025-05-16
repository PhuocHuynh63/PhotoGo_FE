declare module ZUSTAND {
    export interface ICheckoutState {
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

    export interface ISelectedMethodState {
        selectedMethod: string | null
        setSelectedMethod: (method: string | null) => void
        resetSelectedMethod: () => void
    }

    export interface IVendorState {
        vendor: IVendor;
        setVendor: (vendor: IVendor) => void
    }
}
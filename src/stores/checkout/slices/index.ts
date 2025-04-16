export const createCheckoutSlice = (): IZUSTAND.CheckoutState => ({
    currentStep: 1,
    selectedMethod: 'payos',
    selectedDeposit: 30,

    setStep: (step) => {
        return set(() => ({ currentStep: step }))
    },

    selectMethod: (method) => {
        return set((state: IZUSTAND.CheckoutState) => ({
            selectedMethod: state.selectedMethod === method ? null : method,
        }))
    },

    selectDeposit: (value) => {
        return set(() => ({ selectedDeposit: value }))
    },
    nextStep: () => {
        return set((state: IZUSTAND.CheckoutState) => ({
            currentStep: state.currentStep + 1,
        }));
    },

    prevStep: () => {
        return set((state: IZUSTAND.CheckoutState) => ({
            currentStep: state.currentStep > 1 ? state.currentStep - 1 : 1,
        }));
    },
})

// Cần khai báo set bên ngoài slice nếu bạn dùng slice độc lập
let set: any
export const bindSet = (_set: any) => {
    set = _set
}
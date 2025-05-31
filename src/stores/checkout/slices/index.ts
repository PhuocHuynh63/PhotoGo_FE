import { IBookingFormRequest } from "@models/booking/request.model"
import { ZUSTAND } from "../../../types/IZustand"

export const createCheckoutSlice = (
    set: any
): ZUSTAND.ICheckoutState => ({
    currentStep: 1,
    selectedMethod: 'payos',
    selectedDeposit: 30,
    formCheckout: {
        userId: "",
        service_concept_id: "",
        data: "",
        time: "",
        source_type: "web",
        deposit: 30,
        method: 'payos',
        fullName: "",
        phone: "",
        email: "",
        user_note: "",
    },

    setStep: (step) => {
        return set(() => ({ currentStep: step }))
    },

    selectMethod: (method) => {
        return set((state: ZUSTAND.ICheckoutState) => ({
            selectedMethod: state.selectedMethod === method ? null : method,
        }))
    },

    selectDeposit: (value) => {
        return set(() => ({ selectedDeposit: value }))
    },

    setFormCheckout: (data: IBookingFormRequest) => {
        return set(() => ({ formCheckout: data }))
    },

    nextStep: () => {
        return set((state: ZUSTAND.ICheckoutState) => ({
            currentStep: state.currentStep + 1,
        }));
    },

    prevStep: () => {
        return set((state: ZUSTAND.ICheckoutState) => ({
            currentStep: state.currentStep > 1 ? state.currentStep - 1 : 1,
        }));
    },
})

// Cần khai báo set bên ngoài slice nếu bạn dùng slice độc lập
let set: any
export const bindSet = (_set: any) => {
    set = _set
}
import { IBookingFormRequest } from "@models/booking/request.model"
import { ZUSTAND } from "../../../types/IZustand"

export const createCheckoutSlice = (
    set: any
): ZUSTAND.ICheckoutState => ({
    currentStep: 1,
    selectedCheckoutMethod: 'payos',
    selectedDeposit: 30,
    formBooking: {
        userId: "",
        service_concept_id: "",
        date: "",
        time: "",
        source_type: "web",
        deposit: 30,
        method: 'payos',
        fullName: "",
        phone: "",
        email: "",
        user_note: "",
    },

    //TODO: Bắt validate cho stepFormBooking

    setStep: (step) => {
        return set(() => ({ currentStep: step }))
    },

    selectCheckoutMethod: (method) => {
        return set((state: ZUSTAND.ICheckoutState) => ({
            selectedCheckoutMethod: state.selectedCheckoutMethod === method ? null : method,
        }))
    },

    selectDeposit: (value) => {
        return set(() => ({ selectedDeposit: value }))
    },

    setFormBooking: (data: IBookingFormRequest) => {
        return set((state: ZUSTAND.ICheckoutState) => ({
            formBooking: {
                ...state.formBooking,
                ...data
            }
        }))
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
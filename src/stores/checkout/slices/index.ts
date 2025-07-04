import { IBookingFormRequest } from "@models/booking/request.model"
import { ZUSTAND } from "../../../types/IZustand"

export const createCheckoutSlice = (
    set: any
): ZUSTAND.ICheckoutState => ({
    currentStep: 1,
    selectedCheckoutMethod: 'payos',
    selectedDepositAmount: 30,
    formBooking: {
        userId: "",
        serviceConceptId: "",
        date: "",
        time: "",
        locationId: "",
        sourceType: "trực tiếp",
        depositAmount: 30,
        // method: 'payos',
        fullName: "",
        phone: "",
        email: "",
        userNote: "",
        voucherId: "",
    },
    step: 1,
    isValidStep: {
        1: false,
        2: false,
        3: true,
    },
    checkoutSession: null,

    setStep: (step) => {
        return set(() => ({ currentStep: step }))
    },

    selectCheckoutMethod: (method) => {
        return set((state: ZUSTAND.ICheckoutState) => ({
            selectedCheckoutMethod: state.selectedCheckoutMethod === method ? null : method,
        }))
    },

    selectDepositAmount: (value) => {
        return set(() => ({ selectedDepositAmount: value }))
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

    setIsValidStep: (step: number, isValid: boolean) => {
        return set((state: ZUSTAND.ICheckoutState) => ({
            isValidStep: {
                ...state.isValidStep,
                [step]: isValid,
            }
        }));
    },

    setCheckoutSession: (session) => {
        return set(() => ({ checkoutSession: session }))
    },
})

// Cần khai báo set bên ngoài slice nếu bạn dùng slice độc lập
let set: any
export const bindSet = (_set: any) => {
    set = _set
}
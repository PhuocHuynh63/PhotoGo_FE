import { IBookingFormRequest } from "@models/booking/request.model";

declare module ZUSTAND {
    export interface ICheckoutState {
        currentStep: number;
        selectedDeposit: number;
        selectedMethod: string | null;
        formCheckout: IBookingFormRequest;
        setStep: (step: number) => void;
        nextStep: () => void;
        prevStep: () => void;
        selectDeposit: (percent: number) => void;
        selectMethod: (method: string | null) => void;
        setFormCheckout: (data: IBookingFormRequest) => void;
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

    export interface IUserState {
        token: string | null;
        session: METADATA.ISession | null;
        setToken: (token: string | null) => void;
        setSession: (session: METADATA.ISession | null) => void;
    }
}
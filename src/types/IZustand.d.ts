import { IBookingFormRequest } from "@models/booking/request.model";
import { IUser } from "@models/user/common.model";

declare module ZUSTAND {
    export interface ICheckoutState {
        currentStep: number;
        selectedDepositAmount: number;
        selectedCheckoutMethod: string | null;
        formBooking: IBookingFormRequest;
        step: number;
        isValidStep: Record<number, boolean>;
        setStep: (step: number) => void;
        nextStep: () => void;
        prevStep: () => void;
        selectDepositAmount: (percent: number) => void;
        selectCheckoutMethod: (method: string | null) => void;
        setFormBooking: (data: IBookingFormRequest) => void;
        setIsValidStep: (step: number, isValid: boolean) => void;
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
        session: METADATA.ISession | null;
        user: IUser | null;
        setSession: (session: METADATA.ISession | null) => void;
        setUser: (user: IUser | null) => void;
    }
}
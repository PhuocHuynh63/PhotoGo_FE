import { IBookingFormRequest } from "@models/booking/request.model";
import { IServiceConceptImage } from "@models/serviceConcepts/common.model";
import { IUser } from "@models/user/common.model";
import { ICartItem } from "@models/cart/common.model";

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
        serviceConceptImages: IServiceConceptImage[];
        setVendor: (vendor: IVendor) => void;
        setServiceImages: (serviceConceptImages: IServiceConceptImage) => void;
        addMoreConceptImages: (images: IServiceConceptImageModel[]) => void;
    }

    export interface IUserState {
        session: METADATA.ISession | null;
        user: IUser | null;
        setSession: (session: METADATA.ISession | null) => void;
        setUser: (user: IUser | null) => void;
    }

    export interface ICartState {
        cart: ICartItem[] | null
        getCart: () => ICartItem[] | null
        setCart: (cart: ICartItem[] | null) => void
        addToCart: (serviceConceptId: string, cartId: string, userId: string) => Promise<void>
        removeItem: (itemId: string, cartId: string) => Promise<void>
        removeItems: (itemIds: string[], cartId: string) => Promise<void>
    }
}
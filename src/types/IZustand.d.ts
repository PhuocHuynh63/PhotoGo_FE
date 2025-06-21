import { IBookingFormRequest } from "@models/booking/request.model";
import { IServiceConcept, IServiceConceptImage } from "@models/serviceConcepts/common.model";
import { IServicePackage } from "@models/servicePackages/common.model";
import { IUser } from "@models/user/common.model";
import { IReviewPaginationResponse } from "@models/review/repsonse.model";
import { ICheckoutSession } from "@models/checkoutSession/common.model";

declare namespace ZUSTAND {
    export interface ICheckoutState {
        currentStep: number;
        selectedDepositAmount: number;
        selectedCheckoutMethod: string | null;
        formBooking: IBookingFormRequest;
        step: number;
        isValidStep: Record<number, boolean>;
        checkoutSession: ICheckoutSession | null;
        setStep: (step: number) => void;
        nextStep: () => void;
        prevStep: () => void;
        selectDepositAmount: (percent: number) => void;
        selectCheckoutMethod: (method: string | null) => void;
        setFormBooking: (data: IBookingFormRequest) => void;
        setIsValidStep: (step: number, isValid: boolean) => void;
        setCheckoutSession: (session: ICheckoutSession | null) => void;
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
        servicePackage: IServicePackage;
        concept: IServiceConcept;
        reviews: IReviewPaginationResponse;
        addressLocation: { id: string, address: string } | null;
        setVendor: (vendor: IVendor) => void;
        setServiceImages: (serviceConceptImages: IServiceConceptImage) => void;
        addMoreConceptImages: (images: IServiceConceptImageModel[]) => void;
        setServicePackage: (servicePackage: IServicePackage) => void;
        setConcept: (concept: IServiceConcept) => void;
        setReviews: (reviews: IReviewPaginationResponse) => void;
        setAddressLocation: (addressLocation: { id: string, address: string }) => void;
    }

    export interface IUserState {
        session: METADATA.ISession | null;
        user: IUser | null;
        setSession: (session: METADATA.ISession | null) => void;
        setUser: (user: IUser | null) => void;
    }

    export interface ICartState {
        cart: ICartResponse | null
        getCart: () => ICartResponse | null
        setCart: (cart: ICartResponse | null) => void
        addToCart: (serviceConceptId: string, cartId: string, userId: string) => Promise<void>
        removeItem: (itemId: string, cartId: string) => Promise<void>
        removeItems: (itemIds: string[], cartId: string) => Promise<void>
    }

    export interface IChatingState {

    }
}
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createCheckoutSlice } from './checkout/slices'
import { createPricingSlice } from './pricing/slices'
import { createVendorSlice } from './vendor/slices'
import { createUserSlice } from './user/slices'
import { ZUSTAND } from '../types/IZustand'
import { createCartSlice } from './cart/slices'


export const useStore = create<ZUSTAND.ICheckoutState & ZUSTAND.ISelectedMethodState & ZUSTAND.IVendorState & ZUSTAND.IUserState & ZUSTAND.ICartState>()(
    devtools(
        (set, get, api) => ({
            ...createCheckoutSlice(set),
            ...createPricingSlice(set),
            ...createVendorSlice(set),
            ...createUserSlice(set),
            ...createCartSlice(set, get, api),
        }),
    )
)
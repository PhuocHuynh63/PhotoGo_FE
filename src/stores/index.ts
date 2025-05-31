import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createCheckoutSlice } from './checkout/slices'
import { createPricingSlice } from './pricing/slices'
import { createVendorSlice } from './vendor/slices'
import { createUserSlice } from './user/slices'
import { ZUSTAND } from '../types/IZustand'


export const useStore = create<ZUSTAND.ICheckoutState & ZUSTAND.ISelectedMethodState & ZUSTAND.IVendorState & ZUSTAND.IUserState>()(
    devtools((set, get) => ({
        ...createCheckoutSlice(set),
        ...createPricingSlice(set),
        ...createVendorSlice(set),
        ...createUserSlice(set),
    }))
)
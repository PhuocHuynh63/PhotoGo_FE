import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createCheckoutSlice } from './checkout/slices'
import { createPricingSlice } from './pricing/slices'
import { createVendorSlice } from './vendor/slices'


export const useStore = create<ZUSTAND.ICheckoutState & ZUSTAND.ISelectedMethodState & ZUSTAND.IVendorState>()(
    devtools((set, get) => ({
        ...createCheckoutSlice(set),
        ...createPricingSlice(set),
        ...createVendorSlice(set),
    }))
)
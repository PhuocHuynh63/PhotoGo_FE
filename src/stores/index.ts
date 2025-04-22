import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createCheckoutSlice } from './checkout/slices'
import { createPricingSlice } from './pricing/slices'


export const useStore = create<ZUSTAND.ICheckoutState & ZUSTAND.ISelectedMethodState>()(
    devtools((set, get) => ({
        ...createCheckoutSlice(set),
        ...createPricingSlice(set),
    }))
)
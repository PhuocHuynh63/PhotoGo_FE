import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { bindSet, createCheckoutSlice } from './checkout/slices'

export const useStore = create<any>()(
    devtools((set, get) => {
        bindSet(set)
        return {
            ...createCheckoutSlice(),
        }
    })
)
import { ZUSTAND } from "../../../types/IZustand"

export const createPricingSlice = (
    set: any
): ZUSTAND.ISelectedMethodState => ({
    selectedMethod: 'month',

    setSelectedMethod: (method: string | null) => {
        return set(() => ({
            selectedMethod: method,
        }))
    },

    resetSelectedMethod: () => {
        return set(() => ({
            selectedMethod: 'month',
        }))
    },
})

// Cần khai báo set bên ngoài slice nếu bạn dùng slice độc lập
let set: any
export const bindSet = (_set: any) => {
    set = _set
}
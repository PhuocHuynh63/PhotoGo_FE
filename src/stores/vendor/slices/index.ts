import { IVendor } from "@models/vendor/common.model"

export const createVendorSlice = (
    set: any
): ZUSTAND.IVendorState => ({
    vendor: {} as IVendor,

    setVendor(vendor) {
        return set(() => ({
            vendor: vendor,
        }))
    },
})

// Cần khai báo set bên ngoài slice nếu bạn dùng slice độc lập
let set: any
export const bindSet = (_set: any) => {
    set = _set
}
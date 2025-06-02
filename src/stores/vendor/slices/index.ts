import { IVendor } from "@models/vendor/common.model"
import { ZUSTAND } from "../../../types/IZustand"

export const createVendorSlice = (
    set: any
): ZUSTAND.IVendorState => ({
    vendor: {} as IVendor,
    serviceConceptImages: [],

    setServiceImages(serviceConceptImages) {
        return set(() => ({
            serviceConceptImages: serviceConceptImages,
        }))
    },

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
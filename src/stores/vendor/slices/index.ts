import { IVendor } from "@models/vendor/common.model"
import { ZUSTAND } from "../../../types/IZustand"
import { IServicePackage } from "@models/servicePackages/common.model"
import { IServiceConcept } from "@models/serviceConcepts/common.model"

export const createVendorSlice = (
    set: any
): ZUSTAND.IVendorState => ({
    vendor: {} as IVendor,
    serviceConceptImages: [],
    servicePackage: {} as IServicePackage,
    concept: {} as IServiceConcept,

    setVendor(vendor) {
        return set(() => ({
            vendor: vendor,
        }))
    },

    setServiceImages(serviceConceptImages) {
        return set(() => ({
            serviceConceptImages: serviceConceptImages,
        }))
    },

    addMoreConceptImages(images) {
        return set((state: any) => ({
            serviceConceptImages: [...state.serviceConceptImages, ...images],
        }))
    },

    setServicePackage(servicePackage) {
        return set(() => ({
            servicePackage: servicePackage,
        }))
    },

    setConcept(concept) {
        return set(() => ({
            concept: concept,
        }))
    },
})

// Cần khai báo set bên ngoài slice nếu bạn dùng slice độc lập
let set: any
export const bindSet = (_set: any) => {
    set = _set
}
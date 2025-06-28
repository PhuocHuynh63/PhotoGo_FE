import { ZUSTAND } from "../../../types/IZustand"
import { IUser } from "@models/user/common.model"
import { METADATA } from "../../../types/IMetadata";

export const createUserSlice = (
    set: any
): ZUSTAND.IUserState => ({
    user: null,
    session: null,

    setUser(user: IUser | null) {
        return set((state: ZUSTAND.IUserState) => ({
            ...state,
            user,
        }))
    },

    setSession(session: METADATA.ISession | null) {
        return set((state: ZUSTAND.IUserState) => ({
            ...state,
            session,
        }))
    },
})

// Cần khai báo set bên ngoài slice nếu bạn dùng slice độc lập
let set: any
export const bindSet = (_set: any) => {
    set = _set
}
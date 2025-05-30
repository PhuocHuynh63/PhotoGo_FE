export const createUserSlice = (
    set: any
): ZUSTAND.IUserState => ({
    token: null,
    session: null,
    setToken: (token: string | null) => {
        set((state: ZUSTAND.IUserState) => ({
            ...state,
            token,
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
export const createUserSlice = (
    set: any
): ZUSTAND.ITokenState => ({
    token: null,
    setToken: (token: string | null) => {
        set((state: ZUSTAND.ITokenState) => ({
            ...state,
            token,
        }))
    },
})

// Cần khai báo set bên ngoài slice nếu bạn dùng slice độc lập
let set: any
export const bindSet = (_set: any) => {
    set = _set
}
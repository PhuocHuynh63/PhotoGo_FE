"use client";

import { createContext, useContext } from "react";

const VendorContext = createContext(null);

export const VendorContextProvider = ({ value, children }: any) => {
    return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>;
};

export const useVendor = () => useContext(VendorContext);

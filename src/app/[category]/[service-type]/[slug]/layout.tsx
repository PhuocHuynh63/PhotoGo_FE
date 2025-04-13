import Header from "@components/Organisms/Header";
import { useVendor, VendorContextProvider } from "@lib/vendorContext";
import StudioNavigation from "@pages/Public/VendorDetail/StudioNavigation";

export default function VendorDetailLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const vendor = useVendor();

    return (
        <>
            <Header />
            <VendorContextProvider vendor={vendor}>
                

                {/* <StudioNavigation /> */}
                <StudioNavigation />
                {children}
            </VendorContextProvider>
        </>
    );
}

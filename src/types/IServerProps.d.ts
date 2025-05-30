declare namespace SERVERS {
    interface SearchVendorPageProps {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }

    interface VendorDetailPageProps {
        children: React.ReactNode;
        params: Promise<{
            slug: string;
        }>;
    }

    interface CheckoutLayoutProps {
        children: React.ReactNode;
        params: Promise<{
            id: string;
        }>;
    }
}
declare namespace SERVERS {
    interface SearchVendorPageProps {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }

    interface VendorDetailPageProps {
        params: Promise<{
            slug: string;
        }>;
    }

    interface VendorDetailLayoutProps {
        children?: React.ReactNode;
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
    interface ServiceEditPageProps {
        params: Promise<{
            id: string;
        }>;
    }
    interface ServiceViewPageProps {
        params: Promise<{
            id: string;
        }>;
    }
    interface SearchPackagePageProps {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }

    interface CampaignDetailPageProps {
        params: Promise<{
            id: string;
        }>;
    }

    interface PointsPageProps {
        params: Promise<{ id: string }>;
        searchParams: Promise<{ [key: string]: string | string[] | undefined }> | undefined;
    }
}
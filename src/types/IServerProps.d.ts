declare namespace SERVERS {
    interface SearchVendorPageProps {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }
}
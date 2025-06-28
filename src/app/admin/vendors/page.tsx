import AdminVendorsPage from "@pages/Admin/Vendors";
import vendorService from "@services/vendors";
import { IAdminFilterVendorsResponse } from "@models/vendor/response.model";

async function getVendors({ searchParams }: { searchParams: any }) {
    const resolvedParams = await searchParams;
    const params: Record<string, any> = {};
    if (typeof resolvedParams.name === "string") params.name = resolvedParams.name;
    if (typeof resolvedParams.contact === "string") params.contact = resolvedParams.contact;
    if (typeof resolvedParams.status === "string") params.status = resolvedParams.status;
    if (typeof resolvedParams.minBranches === "string") params.minBranches = Number(resolvedParams.minBranches);
    if (typeof resolvedParams.maxBranches === "string") params.maxBranches = Number(resolvedParams.maxBranches);
    if (typeof resolvedParams.minPackages === "string") params.minPackages = Number(resolvedParams.minPackages);
    if (typeof resolvedParams.maxPackages === "string") params.maxPackages = Number(resolvedParams.maxPackages);
    if (typeof resolvedParams.minOrders === "string") params.minOrders = Number(resolvedParams.minOrders);
    if (typeof resolvedParams.maxOrders === "string") params.maxOrders = Number(resolvedParams.maxOrders);
    if (typeof resolvedParams.minRating === "string") params.minRating = Number(resolvedParams.minRating);
    if (typeof resolvedParams.maxRating === "string") params.maxRating = Number(resolvedParams.maxRating);
    if (typeof resolvedParams.minPriority === "string") params.minPriority = Number(resolvedParams.minPriority);
    if (typeof resolvedParams.maxPriority === "string") params.maxPriority = Number(resolvedParams.maxPriority);
    if (typeof resolvedParams.joinDateFrom === "string") params.joinDateFrom = resolvedParams.joinDateFrom;
    if (typeof resolvedParams.joinDateTo === "string") params.joinDateTo = resolvedParams.joinDateTo;
    if (typeof resolvedParams.category === "string") params.category = resolvedParams.category;
    if (typeof resolvedParams.hasLogo === "string") params.hasLogo = resolvedParams.hasLogo === "true";
    if (typeof resolvedParams.current === "string") params.current = Number(resolvedParams.current);
    if (typeof resolvedParams.pageSize === "string") params.pageSize = Number(resolvedParams.pageSize);
    if (typeof resolvedParams.sortBy === "string") params.sortBy = resolvedParams.sortBy;
    if (typeof resolvedParams.sortDirection === "string") params.sortDirection = resolvedParams.sortDirection as "asc" | "desc";

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") urlParams.set(key, String(value));
    });

    const res = await vendorService.getAdminVendors(urlParams) as IAdminFilterVendorsResponse;
    if (res?.data?.data) {
        res.data.data = res.data.data.map((vendor: any) => ({
            ...vendor,
            category: vendor.category
                ? { ...vendor.category, description: vendor.category.description ?? "" }
                : undefined,
        }));
    }
    const vendors = res.data.data;
    const pagination = res.data.pagination;
    return { vendors, pagination };
}

export default async function Page({ searchParams }: { searchParams?: any }) {
    const { vendors, pagination } = await getVendors({ searchParams });
    if (!vendors) {
        return <div>Không có dữ liệu nhà cung cấp hoặc có lỗi khi lấy dữ liệu.</div>;
    }
    return <AdminVendorsPage vendors={vendors} pagination={pagination} />;
}


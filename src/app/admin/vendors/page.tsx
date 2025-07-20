import AdminVendorsPage from "@pages/Admin/Vendors";

export const dynamic = 'force-dynamic';
import vendorService from "@services/vendors";
import { IAdminFilterVendorsResponse } from "@models/vendor/response.model";

async function getVendors({ searchParams }: { searchParams: any }) {
    // Trong Next.js 15, searchParams cần được await
    const resolvedParams = await searchParams;
    const params: Record<string, any> = {};

    // Xử lý các tham số tìm kiếm
    if (resolvedParams?.name) params.name = resolvedParams.name;
    if (resolvedParams?.contact) params.contact = resolvedParams.contact;
    if (resolvedParams?.status && resolvedParams.status !== 'all') params.status = resolvedParams.status;
    if (resolvedParams?.category && resolvedParams.category !== 'all') params.category = resolvedParams.category;

    // Xử lý các tham số range
    if (resolvedParams?.minBranches) params.minBranches = Number(resolvedParams.minBranches);
    if (resolvedParams?.maxBranches) params.maxBranches = Number(resolvedParams.maxBranches);
    if (resolvedParams?.minPackages) params.minPackages = Number(resolvedParams.minPackages);
    if (resolvedParams?.maxPackages) params.maxPackages = Number(resolvedParams.maxPackages);
    if (resolvedParams?.minOrders) params.minOrders = Number(resolvedParams.minOrders);
    if (resolvedParams?.maxOrders) params.maxOrders = Number(resolvedParams.maxOrders);
    if (resolvedParams?.minRating) params.minRating = Number(resolvedParams.minRating);
    if (resolvedParams?.maxRating) params.maxRating = Number(resolvedParams.maxRating);
    if (resolvedParams?.minPriority) params.minPriority = Number(resolvedParams.minPriority);
    if (resolvedParams?.maxPriority) params.maxPriority = Number(resolvedParams.maxPriority);

    // Xử lý các tham số ngày
    if (resolvedParams?.joinDateFrom) params.joinDateFrom = resolvedParams.joinDateFrom;
    if (resolvedParams?.joinDateTo) params.joinDateTo = resolvedParams.joinDateTo;

    // Xử lý các tham số khác
    if (resolvedParams?.hasLogo) params.hasLogo = resolvedParams.hasLogo === "true";
    if (resolvedParams?.current) params.current = Number(resolvedParams.current);
    if (resolvedParams?.pageSize) params.pageSize = Number(resolvedParams.pageSize);
    if (resolvedParams?.sortBy && resolvedParams.sortBy !== 'all') params.sortBy = resolvedParams.sortBy;
    if (resolvedParams?.sortDirection) params.sortDirection = resolvedParams.sortDirection as "asc" | "desc";

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
            urlParams.set(key, String(value));
        }
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


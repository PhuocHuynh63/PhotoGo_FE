import AdminVouchersPage from "@pages/Admin/Vouchers";
import voucherService from "@services/voucher";

export const dynamic = 'force-dynamic';

async function getVouchers({ searchParams }: { searchParams: any }) {
    const resolvedParams = await searchParams;
    const params: Record<string, any> = {};
    if (typeof resolvedParams.term === "string") params.term = resolvedParams.term;
    if (typeof resolvedParams.status === "string") params.status = resolvedParams.status;
    if (typeof resolvedParams.type === "string") params.type = resolvedParams.type;
    if (typeof resolvedParams.discountType === "string") params.discountType = resolvedParams.discountType;
    if (typeof resolvedParams.current === "string") params.current = Number(resolvedParams.current);
    if (typeof resolvedParams.pageSize === "string") params.pageSize = Number(resolvedParams.pageSize);

    // Set default pageSize nếu không có
    if (!params.pageSize) params.pageSize = 10; // fallback 10 nếu không có
    if (typeof resolvedParams.sortBy === "string") params.sortBy = resolvedParams.sortBy;
    if (typeof resolvedParams.sortDirection === "string") params.sortDirection = resolvedParams.sortDirection as "asc" | "desc";

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") urlParams.set(key, String(value));
    });

    try {
        const res = await voucherService.getAdminVouchers(urlParams) as any;
        // Mapping đúng với response thực tế
        const vouchers = res?.data?.data || [];
        const rawPagination = res?.data?.pagination || {
            current: 1,
            pageSize: 10,
            totalItem: 0,
            totalPage: 1
        };

        // Đảm bảo totalPage được tính đúng
        const pagination = {
            ...rawPagination,
            totalPage: rawPagination.totalPage || Math.ceil(rawPagination.totalItem / rawPagination.pageSize) || 1,
            current: rawPagination.current || 1,
            pageSize: rawPagination.pageSize || 10,
            totalItem: rawPagination.totalItem || 0
        };

        return { vouchers, pagination };
    } catch (error) {
        //console.error('Error fetching vouchers:', error);
        return {
            vouchers: [],
            pagination: {
                current: 1,
                pageSize: 10,
                totalItem: 0,
                totalPage: 1
            }
        };
    }
}

export default async function Page({ searchParams }: { searchParams?: any }) {
    const { vouchers, pagination } = await getVouchers({ searchParams });
    return <AdminVouchersPage vouchers={vouchers || []} pagination={pagination} />;
}

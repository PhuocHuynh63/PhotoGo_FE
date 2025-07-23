import PointsPage from "@pages/Admin/Points";
import { pointService } from "@services/point";
import { IPointAdminResponse } from "@models/point/response.model";

async function getPoints({ searchParams }: { searchParams: any }) {
    // Handle both Promise and non-Promise searchParams
    const resolvedParams = searchParams || {};
    const params: Record<string, any> = {};
    if (typeof resolvedParams.term === "string") params.term = resolvedParams.term;
    if (typeof resolvedParams.sortBy === "string") params.sortBy = resolvedParams.sortBy;
    if (typeof resolvedParams.sortDirection === "string") params.sortDirection = resolvedParams.sortDirection;
    if (typeof resolvedParams.current === "string") params.current = resolvedParams.current;
    if (typeof resolvedParams.pageSize === "string") params.pageSize = resolvedParams.pageSize;
    if (!params.pageSize) params.pageSize = 10;
    if (!params.sortBy) params.sortBy = "balance";
    if (!params.sortDirection) params.sortDirection = "desc";

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") urlParams.set(key, String(value));
    });

    try {
        const res = await pointService.getPointAdmin(urlParams) as IPointAdminResponse;
        const points = res?.data?.data || [];
        const rawPagination = res?.data?.pagination || {
            current: 1,
            pageSize: 10,
            totalItem: 0,
            totalPage: 1
        };
        const pagination = {
            ...rawPagination,
            totalPage: rawPagination.totalPage || Math.ceil(rawPagination.totalItem / rawPagination.pageSize) || 1,
            current: rawPagination.current || 1,
            pageSize: rawPagination.pageSize || 10,
            totalItem: rawPagination.totalItem || 0
        };
        return { points, pagination, params };
    } catch (error) {
        return {
            points: [],
            pagination: {
                current: 1,
                pageSize: 10,
                totalItem: 0,
                totalPage: 1
            },
            params: {}
        };
    }
}

interface PageProps {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | undefined;
}

export default async function Page({ searchParams }: PageProps) {
    const resolvedSearchParams = (await searchParams) || {};
    const { points, pagination, params } = await getPoints({ searchParams: resolvedSearchParams });
    
    // Ensure pagination has all required properties
    const safePagination = {
        current: pagination?.current || 1,
        pageSize: pagination?.pageSize || 10,
        totalItem: pagination?.totalItem || 0,
        totalPage: pagination?.totalPage || 1
    };
    
    return (
        <PointsPage
            points={points || []}
            pagination={safePagination}
            initialEmail={params?.term || ""}
            initialMinBalance={""}
            initialMaxBalance={""}
        />
    );
}
import { pointService } from "@services/point";
import { IPointTransactionResponse } from "@models/point/response.model";
import PointsHistoryPage from "@pages/Admin/Points/[userId]";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ userId: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | undefined;
}

async function getPointHistory(userId: string, searchParams: any) {
    const params: Record<string, any> = {};
    if (typeof searchParams?.current === "string") params.current = searchParams.current;
    if (typeof searchParams?.pageSize === "string") params.pageSize = searchParams.pageSize;
    if (typeof searchParams?.sortDirection === "string") params.sortDirection = searchParams.sortDirection;
    if (typeof searchParams?.type === "string") params.type = searchParams.type;
    if (typeof searchParams?.startDate === "string") params.startDate = searchParams.startDate;
    if (typeof searchParams?.endDate === "string") params.endDate = searchParams.endDate;
    if (typeof searchParams?.minAmount === "string") params.minAmount = searchParams.minAmount;
    if (typeof searchParams?.maxAmount === "string") params.maxAmount = searchParams.maxAmount;
    if (typeof searchParams?.direction === "string") params.direction = searchParams.direction;
    if (!params.pageSize) params.pageSize = 10;
    if (!params.current) params.current = 1;

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") urlParams.set(key, String(value));
    });

    try {
        const res = await pointService.getPointHistory(userId, urlParams) as IPointTransactionResponse;
        const transactions = res?.data?.data || [];
        const pagination = res?.data?.pagination || { current: 1, pageSize: 10, totalItem: 0, totalPage: 1 };
        return { transactions, pagination };
    } catch (error) {
        return { transactions: [], pagination: { current: 1, pageSize: 10, totalItem: 0, totalPage: 1 } };
    }
}

export default async function Page({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const userId = resolvedParams.userId;
    if (!userId) return notFound();
    const resolvedSearchParams = (await searchParams) || {};
    const { transactions, pagination } = await getPointHistory(userId, resolvedSearchParams);
    return <PointsHistoryPage userId={userId} transactions={transactions} pagination={pagination} />;
}
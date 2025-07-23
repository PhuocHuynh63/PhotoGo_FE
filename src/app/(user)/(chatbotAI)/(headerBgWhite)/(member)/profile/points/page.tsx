import { IPagination } from "@models/metadata";
import { IPoint, IPointTransaction } from "@models/point/common.model";
import { IPointResponse, IPointTransactionResponse } from "@models/point/response.model";
import PointsPage from "@pages/Member/Profile/Right/PointContent"
import { pointService } from "@services/point";

async function getPoint() {
    const response = await pointService.getPoint();
    return response;
}

async function getPointTransaction() {
    const response = await pointService.getPointTransaction();
    return response;
}

export default async function Points() {
    const point = await getPoint() as IPointResponse;
    const pointTransaction = await getPointTransaction() as IPointTransactionResponse;
    const pointData = point?.data as unknown as IPoint;
    const pointTransactionData = pointTransaction?.data?.data as unknown as IPointTransaction[];
    const paginationPointTransaction = pointTransaction?.data?.pagination as unknown as IPagination;

    return (
        <PointsPage point={pointData} pointTransaction={pointTransactionData} pagination={paginationPointTransaction} />
    )
}
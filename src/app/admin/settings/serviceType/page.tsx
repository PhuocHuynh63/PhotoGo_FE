
import AdminServiceTypesPage from "@pages/Admin/Settings/ServiceTypes";
import { serviceTypeService } from "@services/serviceType";
import { IServiceTypeFilterResponse } from "@models/serviceTypes/response.model";

async function getServiceTypes({ searchParams }: { searchParams: any }) {
    const paramsObj = await searchParams;
    const params: Record<string, any> = {};
    if (typeof paramsObj?.name === "string") params.name = paramsObj.name;
    if (typeof paramsObj?.status === "string") params.status = paramsObj.status;
    if (typeof paramsObj?.sortBy === "string") params.sortBy = paramsObj.sortBy;
    if (typeof paramsObj?.sortDirection === "string") params.sortDirection = paramsObj.sortDirection;
    if (typeof paramsObj?.current === "string") params.current = Number(paramsObj.current);
    if (typeof paramsObj?.pageSize === "string") params.pageSize = Number(paramsObj.pageSize);

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") urlParams.set(key, String(value));
    });

    const res = await serviceTypeService.getServiceTypesWithFilter(urlParams) as IServiceTypeFilterResponse;
    const serviceTypes = res?.data?.data || [];
    const pagination = res?.data?.pagination || {};
    return { serviceTypes, pagination };
}

export default async function Page({ searchParams }: { searchParams?: any }) {
    const paramsObj = await searchParams;
    const { serviceTypes, pagination } = await getServiceTypes({ searchParams: paramsObj || {} });
    return <AdminServiceTypesPage serviceTypes={serviceTypes} pagination={pagination} />;
}

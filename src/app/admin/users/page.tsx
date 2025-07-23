import AdminUsersPage from "@pages/Admin/Users";
import userService from "@services/user";
import { IAdminGetUsersRequest } from "@models/user/request.model";

async function getUsers({ searchParams }: { searchParams: any }) {
    const resolvedParams = await searchParams;

    const params: IAdminGetUsersRequest = {};
    if (typeof resolvedParams.q === "string") params.term = resolvedParams.q;
    if (typeof resolvedParams.role === "string") params.role = resolvedParams.role;
    if (typeof resolvedParams.status === "string") params.status = resolvedParams.status;
    if (typeof resolvedParams.rank === "string") params.rank = resolvedParams.rank;
    if (typeof resolvedParams.current === "string") params.current = Number(resolvedParams.current);
    if (typeof resolvedParams.pageSize === "string") params.pageSize = Number(resolvedParams.pageSize);
    if (typeof resolvedParams.sortBy === "string") params.sortBy = resolvedParams.sortBy;
    if (typeof resolvedParams.sortDirection === "string") params.sortDirection = resolvedParams.sortDirection as "asc" | "desc";


    const response = await userService.getUsers(params);
    return response.data;
}

export default async function Page({ searchParams }: { searchParams?: any }) {
    const usersData = await getUsers({ searchParams });
    if (!usersData || !usersData.data) {
        return <div>Không có dữ liệu người dùng hoặc có lỗi khi lấy dữ liệu.</div>;
    }
    return <AdminUsersPage users={usersData.data} pagination={usersData.pagination} />;
}

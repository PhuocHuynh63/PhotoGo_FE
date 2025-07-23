'use client';
import { useState } from "react";
import { DataTable } from "@components/Organisms/Table/data-table";
import { BadgeWrapper } from "@components/Atoms/Badge/BadgeWrapper";
import Button from "@components/Atoms/Button";
import Input from "@components/Atoms/Input";
import Select from "@components/Atoms/Select";
import LucideIcon from "@components/Atoms/LucideIcon";
import { IPoint } from "@models/point/common.model";
import { IPagination } from "@models/metadata";
import Image from "next/image";
import { Avatar } from "@components/Molecules/Avatar";
import { useRouter } from "next/navigation";

interface PointsPageProps {
    points: IPoint[];
    pagination: IPagination;
    initialEmail?: string;
    initialMinBalance?: string;
    initialMaxBalance?: string;
}

const SORT_DIRECTION_OPTIONS = [
    { value: 'asc', name: 'Điểm tăng dần' },
    { value: 'desc', name: 'Điểm giảm dần' },
];

export default function PointsPage({ points, pagination, initialEmail = "", initialMinBalance = "", initialMaxBalance = "" }: PointsPageProps) {
    const [email, setEmail] = useState(initialEmail);
    const [sortDirection, setSortDirection] = useState('desc');
    const [current, setCurrent] = useState(pagination?.current || 1);
    const [pageSize] = useState(pagination?.pageSize || 10);
    const router = useRouter();

    // Xử lý filter
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (email) params.set("term", email);
        params.set("sortBy", "balance");
        params.set("sortDirection", sortDirection);
        params.set("current", String(current));
        params.set("pageSize", String(pageSize));
        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        setEmail("");
        setSortDirection("desc");
        const params = new URLSearchParams();
        params.set("sortBy", "balance");
        params.set("sortDirection", "desc");
        params.set("current", "1");
        params.set("pageSize", String(pageSize));
        router.push(`?${params.toString()}`);
    };

    // Định nghĩa cột cho DataTable
    const columns = [
        {
            id: "userId",
            header: "User ID",
            cell: (point: IPoint) => point.user?.id || "-",
        },
        {
            id: "email",
            header: "Email",
            cell: (point: IPoint) => point.user?.email || "-",
        },
        {
            id: "avatar",
            header: "Avatar",
            cell: (point: IPoint) => {
                const user = point.user;
                return (
                    <Avatar
                        src={user?.avatarUrl || "/default-avatar.png"}
                        alt={user?.fullName || user?.email || "User"}
                        size={40}
                    />
                );
            },
        },
        {
            id: "multiplier",
            header: "Hệ số",
            cell: (point: IPoint) => {
                // multiplier là string, cần parseFloat, nếu không có thì trả về 1
                const user: any = point.user;
                return user?.multiplier ? parseFloat(user.multiplier) : 1;
            },
        },
        {
            id: "balance",
            header: "Điểm",
            cell: (point: IPoint) => (
                <span className="font-semibold text-blue-700">{point.balance.toLocaleString("vi-VN")}</span>
            ),
        },
        {
            id: "action",
            header: "",
            cell: (point: IPoint) => (
                <Button
                    icon="Eye"
                    onClick={() => window.location.href = `/admin/points/${point.user?.id}`}
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg"
                />
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Quản lý điểm người dùng</h1>

                    </div>
                </div>
                {/* Form filter */}
                <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row gap-4 items-end mb-6">
                    <div className="flex-1 min-w-[200px]">
                        <Input
                            type="text"
                            placeholder="Tìm theo email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="min-w-[160px]">
                        <Select
                            placeHolder="Sắp xếp điểm"
                            value={sortDirection}
                            onValueChange={setSortDirection}
                            options={SORT_DIRECTION_OPTIONS}
                            className="w-full"
                        />
                    </div>
                    <Button icon="Search" type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Tìm kiếm</Button>
                    <Button icon="RotateCcw" type="button" onClick={handleReset} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 ml-2">Đặt lại</Button>
                </form>
                {/* DataTable */}
                <DataTable
                    columns={columns}
                    data={points}
                    keyExtractor={(item: IPoint) => item.id}
                    pagination={{
                        currentPage: current,
                        totalPages: pagination?.totalPage || 1,
                        totalItems: pagination?.totalItem || 0,
                        onPageChange: (page: number) => {
                            const params = new URLSearchParams(window.location.search);
                            params.set("current", String(page));
                            window.location.search = params.toString();
                        },
                        itemsPerPage: pageSize,
                    }}
                    emptyState={<div className="text-center py-8 text-gray-500">Không có dữ liệu điểm nào</div>}
                />
            </div>
        </div>
    );
}

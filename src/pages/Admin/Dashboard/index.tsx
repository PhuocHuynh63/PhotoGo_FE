'use client'

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Atoms/Card"
import { ArrowUpRight, Users, Store, Calendar, DollarSign, Package } from "lucide-react"
import PlatformOverviewChart from "@components/Organisms/Chart/PlatformOverviewChart"
import UserDistributionChart from "@components/Organisms/Chart/UserDistributionChart"
import SummaryCard from "@components/Molecules/CardSummary"


// Sample data for charts
const platformOverviewData = [
    {
        name: "Jan",
        users: 2500,
        bookings: 1800,
        revenue: 9400,
    },
    {
        name: "Feb",
        users: 3000,
        bookings: 2300,
        revenue: 12000,
    },
    {
        name: "Mar",
        users: 3500,
        bookings: 2900,
        revenue: 15000,
    },
    {
        name: "Apr",
        users: 4200,
        bookings: 3500,
        revenue: 18000,
    },
    {
        name: "May",
        users: 4800,
        bookings: 3800,
        revenue: 21000,
    },
    {
        name: "Jun",
        users: 5500,
        bookings: 4300,
        revenue: 23500,
    },
    {
        name: "Jul",
        users: 6000,
        bookings: 4800,
        revenue: 25000,
    },
]

const userDistributionData = [
    { name: "Customers", value: 65 },
    { name: "Photographers", value: 20 },
    { name: "Studios", value: 10 },
    { name: "Makeup Artists", value: 5 },
]



const AdminDashboardPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Trang chủ  </h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Số lượng người dùng"
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    value="6,284"
                    change="+12.5%"
                    changeColor="text-emerald-500"
                    changeIcon={<ArrowUpRight className="mr-1 h-4 w-4" />}
                />
                <SummaryCard
                    title="Số lượng nhà cung cấp"
                    icon={<Store className="h-4 w-4 text-muted-foreground" />}
                    value="284"
                    change="+8.2%"
                    changeColor="text-emerald-500"
                    changeIcon={<ArrowUpRight className="mr-1 h-4 w-4" />}
                />

                <SummaryCard
                    title="Số lượng đơn hàng"
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    value="4,832"
                    change="+18.7%"
                    changeColor="text-emerald-500"
                    changeIcon={<ArrowUpRight className="mr-1 h-4 w-4" />}
                />

                <SummaryCard
                    title="Doanh thu"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    value="đ 124,580"
                    change="+14.3%"
                    changeColor="text-emerald-500"
                    changeIcon={<ArrowUpRight className="mr-1 h-4 w-4" />}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <PlatformOverviewChart data={platformOverviewData} className="col-span-4" />
                <UserDistributionChart data={userDistributionData} className="col-span-3" />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
"use client"
import StatisticsCharts from "./Right/statistics-charts"
import StatisticsOverview from "./Right/statistics-overview"


export default function StatisticsPage() {
    // Lấy dữ liệu thống kê từ server
    const statisticsData = {
        overview: {
            totalBookings: 124,
            completedBookings: 98,
            cancelledBookings: 12,
            pendingBookings: 14,
            totalRevenue: 24500000,
            averageRating: 4.8,
        },
        charts: {
            bookingsByMonth: [
                { month: "T1", count: 8 },
                { month: "T2", count: 10 },
                { month: "T3", count: 15 },
                { month: "T4", count: 12 },
                { month: "T5", count: 18 },
                { month: "T6", count: 22 },
                { month: "T7", count: 20 },
                { month: "T8", count: 25 },
                { month: "T9", count: 28 },
                { month: "T10", count: 30 },
                { month: "T11", count: 32 },
                { month: "T12", count: 35 },
            ],
            revenueByMonth: [
                { month: "T1", amount: 1200000 },
                { month: "T2", amount: 1500000 },
                { month: "T3", amount: 1800000 },
                { month: "T4", amount: 1600000 },
                { month: "T5", amount: 2000000 },
                { month: "T6", amount: 2200000 },
                { month: "T7", amount: 2100000 },
                { month: "T8", amount: 2400000 },
                { month: "T9", amount: 2600000 },
                { month: "T10", amount: 2800000 },
                { month: "T11", amount: 3000000 },
                { month: "T12", amount: 3300000 },
            ],
        },
    }
    return (


        <div className="mt-4">
            <h2 className="text-xl font-semibold">Thống kê</h2>
            <p className="text-sm text-gray-500">Xem thống kê hoạt động của bạn</p>

            <div className="mt-4">
                <StatisticsOverview data={statisticsData.overview} />
                <StatisticsCharts data={statisticsData.charts} />
            </div>
        </div>

    )
}


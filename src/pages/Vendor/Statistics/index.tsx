"use client"
import StatisticsCharts from "@pages/Vendor/Statistics/StatisticsChart"
import StatisticsOverview from "@pages/Vendor/Statistics/StatisticsOverview"


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
                // Năm 2023
                { month: "Tháng 1 2023", count: 5 },
                { month: "Tháng 2 2023", count: 6 },
                { month: "Tháng 3 2023", count: 7 },
                { month: "Tháng 4 2023", count: 8 },
                { month: "Tháng 5 2023", count: 9 },
                { month: "Tháng 6 2023", count: 10 },
                { month: "Tháng 7 2023", count: 12 },
                { month: "Tháng 8 2023", count: 13 },
                { month: "Tháng 9 2023", count: 14 },
                { month: "Tháng 10 2023", count: 15 },
                { month: "Tháng 11 2023", count: 16 },
                { month: "Tháng 12 2023", count: 17 },

                // Năm 2024 (đã có)
                { month: "Tháng 1 2024", count: 8 },
                { month: "Tháng 2 2024", count: 10 },
                { month: "Tháng 3 2024", count: 15 },
                { month: "Tháng 4 2024", count: 12 },
                { month: "Tháng 5 2024", count: 18 },
                { month: "Tháng 6 2024", count: 22 },
                { month: "Tháng 7 2024", count: 20 },
                { month: "Tháng 8 2024", count: 25 },
                { month: "Tháng 9 2024", count: 28 },
                { month: "Tháng 10 2024", count: 30 },
                { month: "Tháng 11 2024", count: 32 },
                { month: "Tháng 12 2024", count: 35 },

                // Năm 2025
                { month: "Tháng 1 2025", count: 38 },
                { month: "Tháng 2 2025", count: 40 },
                { month: "Tháng 3 2025", count: 42 },
                { month: "Tháng 4 2025", count: 45 },
                { month: "Tháng 5 2025", count: 47 },
                { month: "Tháng 6 2025", count: 50 },
                { month: "Tháng 7 2025", count: 52 },
                { month: "Tháng 8 2025", count: 55 },
                { month: "Tháng 9 2025", count: 57 },
                { month: "Tháng 10 2025", count: 60 },
                { month: "Tháng 11 2025", count: 62 },
                { month: "Tháng 12 2025", count: 65 },
            ],

            revenueByMonth: [
                { month: "Tháng 1 2024", amount: 1200000 },
                { month: "Tháng 2 2024", amount: 1500000 },
                { month: "Tháng 3 2024", amount: 1800000 },
                { month: "Tháng 4 2024", amount: 1600000 },
                { month: "Tháng 5 2024", amount: 2000000 },
                { month: "Tháng 6 2024", amount: 2200000 },
                { month: "Tháng 7 2024", amount: 2100000 },
                { month: "Tháng 8 2024", amount: 2400000 },
                { month: "Tháng 9 2024", amount: 2600000 },
                { month: "Tháng 10 2024", amount: 2800000 },
                { month: "Tháng 11 2024", amount: 3000000 },
                { month: "Tháng 12 2024", amount: 3300000 },
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


'use client'

import FinanceOverview from "./Right/finance-overview"
import TransactionList, { type Transaction } from "./Right/transaction-list"

export default function FinancePage() {
    // Lấy dữ liệu tài chính từ server
    const financeData = {
        overview: {
            totalRevenue: 24500000,
            pendingPayments: 1500000,
            availableBalance: 23000000,
        },
        transactions: [
            {
                id: "TX123456",
                date: "2023-05-15",
                customer: "Nguyễn Văn A",
                amount: 1500000,
                status: "completed" as const,
                type: "booking" as const,
            },
            {
                id: "TX123457",
                date: "2023-05-14",
                customer: "Trần Thị B",
                amount: 2000000,
                status: "completed" as const,
                type: "booking" as const,
            },
            {
                id: "TX123458",
                date: "2023-05-12",
                customer: "Lê Văn C",
                amount: 1800000,
                status: "completed" as const,
                type: "booking" as const,
            },
            {
                id: "TX123459",
                date: "2023-05-10",
                customer: "Phạm Thị D",
                amount: 1200000,
                status: "pending" as const,
                type: "booking" as const,
            },
            {
                id: "WD123460",
                date: "2023-05-05",
                customer: "Rút tiền",
                amount: -5000000,
                status: "completed" as const,
                type: "withdrawal" as const,
            },
        ] as Transaction[],
    }

    return (

        <div className="mt-4">
            <h2 className="text-xl font-semibold">Tài chính</h2>
            <p className="text-sm text-gray-500">Quản lý tài chính và giao dịch của bạn</p>

            <div className="mt-4">
                <FinanceOverview data={financeData.overview} />
                <TransactionList transactions={financeData.transactions} />
            </div>
        </div>

    )
}

'use client'

import { TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { Tabs } from "@components/Atoms/ui/tabs"
import FinanceOverview from "@pages/Vendor/Components/Finances/FinanceOverview"
import RevenueReports from "@pages/Vendor/Components/Finances/RevenueReport"
import InvoiceList from "@pages/Vendor/Components/Finances/InvoiceList"
import TaxReports from "@pages/Vendor/Components/Finances/TaxReport"
import TransactionHistory from "@pages/Vendor/Components/Finances/TransactionHistory"
import UnpaidInvoices from "@pages/Vendor/Components/Finances/UnpaidInvoice"
import BankAccounts from "@pages/Vendor/Components/Finances/BankAccount"
import MonthlyRevenue from "@pages/Vendor/Components/Finances/MonthlyRevenue"
import FinancialSummary from "@pages/Vendor/Components/Finances/FinancialSummary"
import RecentTransactions from "@pages/Vendor/Components/Finances/RecentTransactions"

export default function FinancePage() {
    // Lấy dữ liệu tài chính từ server
    const financeData = {
        overview: {
            totalRevenue: 125000000,
            transferredAmount: 110000000,
            pendingPayments: 15000000,
            availableBalance: 10000000,
        },
        bankAccounts: [
            {
                id: "acc1",
                bankName: "Vietcombank",
                accountNumber: "1234 5678 9012 3456",
                accountHolder: "Studio Anh Dương",
                isPrimary: true,
            },
        ],
        monthlyRevenue: [
            { month: "T1", amount: 15000000 },
            { month: "T2", amount: 18000000 },
            { month: "T3", amount: 22000000 },
            { month: "T4", amount: 20000000 },
            { month: "T5", amount: 25000000 },
            { month: "T6", amount: 30000000 },
            { month: "T7", amount: 28000000 },
            { month: "T8", amount: 32000000 },
            { month: "T9", amount: 35000000 },
            { month: "T10", amount: 38000000 },
            { month: "T11", amount: 40000000 },
            { month: "T12", amount: 42000000 },
        ],
        financialSummary: {
            monthlyRevenue: 35000000,
            monthlyProfit: 5000000,
            profitMargin: 85,
            taxRate: 5,
        },
        recentTransactions: [
            {
                id: "TX-001",
                type: "booking" as const,
                description: "Đặt lịch chụp ảnh cưới",
                date: "2023-05-25",
                time: "09:00",
                amount: 2000000,
                status: "completed" as const,
            },
            {
                id: "TX-002",
                type: "payment" as const,
                description: "Thanh toán còn lại cho chụp ảnh cưới",
                date: "2023-05-25",
                time: "14:00",
                amount: 3000000,
                status: "completed" as const,
            },
            {
                id: "TX-003",
                type: "booking" as const,
                description: "Đặt lịch chụp ảnh gia đình",
                date: "2023-05-24",
                time: "10:00",
                amount: 1500000,
                status: "completed" as const,
            },
            {
                id: "TX-004",
                type: "payment" as const,
                description: "Thanh toán còn lại cho chụp ảnh gia đình",
                date: "2023-05-24",
                time: "15:00",
                amount: 2500000,
                status: "completed" as const,
            },
            {
                id: "TX-005",
                type: "booking" as const,
                description: "Đặt lịch chụp ảnh sản phẩm",
                date: "2023-05-23",
                time: "11:00",
                amount: 1500000,
                status: "completed" as const,
            },
        ],
        unpaidInvoices: [
            {
                id: "INV-004",
                customerName: "Hoàng Văn E",
                amount: 2000000,
                dueDate: "2023-05-27",
            },
            {
                id: "INV-006",
                customerName: "Đặng Văn G",
                amount: 8000000,
                dueDate: "2023-05-24",
            },
            {
                id: "INV-008",
                customerName: "Trịnh Văn I",
                amount: 7500000,
                dueDate: "2023-05-17",
            },
        ],
        allTransactions: [
            {
                id: "TRX-002",
                date: "2023-05-29",
                time: "09:25",
                description: "Thanh toán còn lại cho chụp ảnh cưới",
                category: "Thanh toán còn lại",
                status: "Hoàn thành",
                amount: 3000000,
            },
            {
                id: "TRX-001",
                date: "2023-05-25",
                time: "14:30",
                description: "Đặt cọc chụp ảnh cưới",
                category: "Đặt cọc",
                status: "Hoàn thành",
                amount: 2000000,
            },
            {
                id: "TRX-004",
                date: "2023-05-26",
                time: "10:30",
                description: "Thanh toán còn lại cho chụp ảnh gia đình",
                category: "Thanh toán còn lại",
                status: "Hoàn thành",
                amount: 2500000,
            },
            {
                id: "TRX-003",
                date: "2023-05-24",
                time: "16:15",
                description: "Đặt lịch chụp ảnh gia đình",
                category: "Đặt cọc",
                status: "Hoàn thành",
                amount: 1000000,
            },
            {
                id: "TRX-005",
                date: "2023-05-23",
                time: "11:00",
                description: "Chuyển khoản vào tài khoản ngân hàng",
                category: "Chuyển khoản",
                status: "Hoàn thành",
                amount: 25000000,
            },
            {
                id: "TRX-007",
                date: "2023-05-22",
                time: "09:00",
                description: "Thanh toán còn lại cho chụp ảnh sản phẩm",
                category: "Thanh toán còn lại",
                status: "Hoàn thành",
                amount: 3000000,
            },
            {
                id: "TRX-008",
                date: "2023-05-22",
                time: "08:30",
                description: "Đặt cọc chụp ảnh sản phẩm",
                category: "Đặt cọc",
                status: "Hoàn thành",
                amount: 1500000,
            },
            {
                id: "TRX-009",
                date: "2023-05-21",
                time: "10:45",
                description: "Hoàn tiền cho dịch vụ hủy",
                category: "Hoàn tiền",
                status: "Hoàn thành",
                amount: -1500000,
            },
            {
                id: "TRX-010",
                date: "2023-05-20",
                time: "15:30",
                description: "Đặt cọc chụp ảnh cháu dưới dưới 1 tuổi",
                category: "Đặt cọc",
                status: "Hoàn thành",
                amount: 1000000,
            },
            {
                id: "TRX-011",
                date: "2023-05-20",
                time: "14:30",
                description: "Thanh toán còn lại cho chụp ảnh chân dung",
                category: "Thanh toán còn lại",
                status: "Chờ xử lý",
                amount: 1000000,
            },
        ],
        invoices: [
            {
                id: "INV-001",
                customerName: "Nguyễn Văn A",
                issueDate: "2023-05-25",
                dueDate: "2023-05-31",
                status: "Đã thanh toán",
                amount: 5000000,
            },
            {
                id: "INV-002",
                customerName: "Trần Thị B",
                issueDate: "2023-05-24",
                dueDate: "2023-05-31",
                status: "Đã thanh toán",
                amount: 3000000,
            },
            {
                id: "INV-003",
                customerName: "Lê Văn C",
                issueDate: "2023-05-22",
                dueDate: "2023-05-28",
                status: "Đã thanh toán",
                amount: 4500000,
            },
            {
                id: "INV-004",
                customerName: "Hoàng Văn E",
                issueDate: "2023-05-20",
                dueDate: "2023-05-27",
                status: "Chưa thanh toán",
                amount: 2000000,
            },
            {
                id: "INV-005",
                customerName: "Vũ Thị F",
                issueDate: "2023-05-18",
                dueDate: "2023-05-28",
                status: "Đã thanh toán",
                amount: 10000000,
            },
            {
                id: "INV-006",
                customerName: "Đặng Văn G",
                issueDate: "2023-05-17",
                dueDate: "2023-05-24",
                status: "Chưa thanh toán",
                amount: 8000000,
            },
            {
                id: "INV-007",
                customerName: "Ngô Thị H",
                issueDate: "2023-05-16",
                dueDate: "2023-05-23",
                status: "Đã thanh toán",
                amount: 6000000,
            },
            {
                id: "INV-008",
                customerName: "Trịnh Văn I",
                issueDate: "2023-05-10",
                dueDate: "2023-05-17",
                status: "Quá hạn",
                amount: 7500000,
            },
        ],
        revenueReports: [
            {
                id: "REV-003",
                name: "Báo cáo tháng 3/2025",
                createdAt: "2023-04-01",
                fileUrl: "#",
            },
            {
                id: "REV-002",
                name: "Báo cáo tháng 2/2025",
                createdAt: "2023-03-01",
                fileUrl: "#",
            },
            {
                id: "REV-001",
                name: "Báo cáo tháng 1/2025",
                createdAt: "2023-02-01",
                fileUrl: "#",
            },
        ],
        taxReports: [
            {
                id: "TAX-002",
                name: "Báo cáo thuế Quý 1/2025",
                createdAt: "2023-04-05",
                fileUrl: "#",
            },
            {
                id: "TAX-001",
                name: "Báo cáo thuế Quý 4/2024",
                createdAt: "2023-01-05",
                fileUrl: "#",
            },
        ],
    }

    return (

        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tài chính</h2>
            <p className="text-sm text-gray-500">Quản lý tài chính và giao dịch của bạn</p>

            <Tabs defaultValue="overview" className="mt-6">
                <TabsList >
                    <TabsTrigger
                        value="overview"
                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none"
                    >
                        Tổng quan
                    </TabsTrigger>
                    <TabsTrigger
                        value="transactions"
                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none"
                    >
                        Giao dịch
                    </TabsTrigger>
                    <TabsTrigger
                        value="invoices"
                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none"
                    >
                        Hóa đơn
                    </TabsTrigger>
                    <TabsTrigger
                        value="reports"
                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none"
                    >
                        Báo cáo
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <FinanceOverview data={financeData.overview} />

                    <BankAccounts accounts={financeData.bankAccounts} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MonthlyRevenue data={financeData.monthlyRevenue} />
                        <FinancialSummary data={financeData.financialSummary} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RecentTransactions transactions={financeData.recentTransactions} />
                        <UnpaidInvoices invoices={financeData.unpaidInvoices} />
                    </div>
                </TabsContent>

                <TabsContent value="transactions">
                    <TransactionHistory transactions={financeData.allTransactions} />
                </TabsContent>

                <TabsContent value="invoices">
                    <InvoiceList invoices={financeData.invoices} />
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RevenueReports reports={financeData.revenueReports} />
                        <TaxReports reports={financeData.taxReports} />
                    </div>
                </TabsContent>
            </Tabs>



        </div>

    )
}

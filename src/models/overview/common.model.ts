import { InvoiceStatisticsModel } from "@models/invoice/common.model";
import { z } from "zod";


/**
 *  Dashboard Overview Models
 */
export const MonthlyRevenueModel = z.object({
    month: z.number(),
    monthName: z.string(),
    revenue: z.number(),
});

export const CommissionStatisticsModel = z.object({
    totalCommissionAmount: z.number(),
    percentageCommissions: z.number(),
    fixedCommissions: z.number(),
    thisMonthCommissionAmount: z.number(),
});

export const FinancialInfoModel = z.object({
    thisMonthRevenue: z.number(),
    thisMonthProfit: z.number(),
    profitRatio: z.number(),
    taxRate: z.number(),
    revenueGrowth: z.number(),
    profitGrowth: z.number(),
});

export const RecentTransactionModel = z.object({
    id: z.string(),
    description: z.string(),
    amount: z.number(),
    date: z.string(),
    status: z.string(),
    type: z.string(),
});

export const UnpaidInvoiceModel = z.object({
    id: z.string(),
    customerName: z.string(),
    dueDate: z.string(),
    amount: z.number(),
    status: z.string(),
});

export const FinanceOverviewModel = z.object({
    totalRevenue: z.number(),
    pendingPayments: z.number(),
    monthlyRevenue: z.array(MonthlyRevenueModel),
    commissionStatistics: CommissionStatisticsModel,
    invoiceStatistics: InvoiceStatisticsModel,
    financialInfo: FinancialInfoModel,
    recentTransactions: z.array(RecentTransactionModel),
    unpaidInvoices: z.array(UnpaidInvoiceModel),
});

export type IFinanceOverview = z.TypeOf<typeof FinanceOverviewModel>;
//----------------------End----------------------//

/**
 *  Booking Overview Models
 */
export const MonthlyBookingModel = z.object({
    month: z.number(),
    monthName: z.string(),
    count: z.number(),
});

export const StatusBreakdownModel = z.object({
    notPaid: z.number(),
    paid: z.number(),
    pending: z.number(),
    confirmed: z.number(),
    progressing: z.number(),
    completed: z.number(),
    cancelled: z.number(),
});

export const BookingOverviewModel = z.object({
    averageRating: z.number(),
    cancelledAppointments: z.number(),
    cancelledPercentage: z.number(),
    completedAppointments: z.number(),
    completedPercentage: z.number(),
    confirmedAppointments: z.number(),
    confirmedPercentage: z.number(),
    monthlyBookings: z.array(MonthlyBookingModel),
    paidAppointments: z.number(),
    paidPercentage: z.number(),
    pendingAppointments: z.number(),
    pendingPercentage: z.number(),
    statusBreakdown: StatusBreakdownModel,
    totalAppointments: z.number(),
});

export type IBookingOverview = z.TypeOf<typeof BookingOverviewModel>;
//----------------------End----------------------//



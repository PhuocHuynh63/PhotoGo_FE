import SubscriptionManagement, { } from "@pages/Vendor/Subscription"
import { getServerSession } from "next-auth";
import { IUserResponse } from "@models/user/response.model";
import { authOptions } from "@lib/authOptions";
import { METADATA } from "../../../../../types/IMetadata";
import vendorService from "@services/vendors";
import { IVendor } from "@models/vendor/common.model";

async function getVendor(userId: string) {
    const user = await vendorService.getVendorByUserId(userId);
    return user;
}

export default async function SubscriptionPage() {
    // Lấy dữ liệu subscription từ server

    const session = await getServerSession(authOptions) as METADATA.ISession;
    let vendorData: IVendor | undefined;

    if (session?.user?.id) {
        const user = await getVendor(session.user.id) as IUserResponse;
        vendorData = user?.data as IVendor | undefined;
    }

    if (!vendorData) {
        return null;
    }

    const subscriptionData = await getSubscriptionData()

    return (
        <>
            <SubscriptionManagement data={subscriptionData} vendor={vendorData} />
        </>
    )
}

// Server-side function để lấy dữ liệu subscription
async function getSubscriptionData() {
    // Trong thực tế, đây sẽ là API call hoặc database query
    return {
        currentPlan: {
            id: "plan_premium_2024",
            name: "Premium",
            type: "premium",
            price: 299000,
            billingCycle: "monthly",
            startDate: "2024-12-01T00:00:00Z",
            endDate: "2025-01-01T00:00:00Z",
            status: "active",
            features: [
                "Không giới hạn booking",
                "Quản lý 5 chi nhánh",
                "Báo cáo chi tiết",
                "Hỗ trợ 24/7",
                "Tích hợp thanh toán",
                "Backup tự động",
                "API access",
                "Custom branding",
            ],
            usage: {
                bookings: { used: 847, limit: -1 }, // -1 = unlimited
                branches: { used: 3, limit: 5 },
                storage: { used: 2.4, limit: 50 }, // GB
                apiCalls: { used: 12450, limit: 50000 },
            },
        },
        subscriptionHistory: [
            {
                id: "sub_001",
                planName: "Premium",
                planType: "premium",
                price: 299000,
                billingCycle: "monthly",
                startDate: "2024-12-01T00:00:00Z",
                endDate: "2025-01-01T00:00:00Z",
                status: "active",
                paymentMethod: "VietQR",
                transactionId: "TXN_20241201_001",
                invoiceUrl: "/invoices/sub_001.pdf",
            },
            {
                id: "sub_002",
                planName: "Premium",
                planType: "premium",
                price: 299000,
                billingCycle: "monthly",
                startDate: "2024-11-01T00:00:00Z",
                endDate: "2024-12-01T00:00:00Z",
                status: "completed",
                paymentMethod: "VietQR",
                transactionId: "TXN_20241101_002",
                invoiceUrl: "/invoices/sub_002.pdf",
            },
            {
                id: "sub_003",
                planName: "Basic",
                planType: "basic",
                price: 99000,
                billingCycle: "monthly",
                startDate: "2024-10-01T00:00:00Z",
                endDate: "2024-11-01T00:00:00Z",
                status: "completed",
                paymentMethod: "Banking",
                transactionId: "TXN_20241001_003",
                invoiceUrl: "/invoices/sub_003.pdf",
            },
            {
                id: "sub_004",
                planName: "Basic",
                planType: "basic",
                price: 99000,
                billingCycle: "monthly",
                startDate: "2024-09-01T00:00:00Z",
                endDate: "2024-10-01T00:00:00Z",
                status: "completed",
                paymentMethod: "VietQR",
                transactionId: "TXN_20240901_004",
                invoiceUrl: "/invoices/sub_004.pdf",
            },
            {
                id: "sub_005",
                planName: "Starter",
                planType: "starter",
                price: 0,
                billingCycle: "monthly",
                startDate: "2024-08-01T00:00:00Z",
                endDate: "2024-09-01T00:00:00Z",
                status: "completed",
                paymentMethod: "Free Trial",
                transactionId: "FREE_TRIAL_001",
                invoiceUrl: null,
            },
        ],
        availablePlans: [
            {
                id: "starter",
                name: "Starter",
                price: 0,
                billingCycle: "monthly",
                description: "Dành cho photographer mới bắt đầu",
                features: ["Tối đa 50 booking/tháng", "1 chi nhánh", "Báo cáo cơ bản", "Hỗ trợ email", "5GB lưu trữ"],
                limitations: ["Không có API access", "Không có custom branding", "Không có backup tự động"],
            },
            {
                id: "basic",
                name: "Basic",
                price: 99000,
                billingCycle: "monthly",
                description: "Phù hợp cho studio nhỏ",
                features: [
                    "Tối đa 200 booking/tháng",
                    "2 chi nhánh",
                    "Báo cáo chi tiết",
                    "Hỗ trợ chat",
                    "20GB lưu trữ",
                    "Tích hợp thanh toán cơ bản",
                ],
                limitations: ["Không có API access", "Không có custom branding"],
            },
            {
                id: "premium",
                name: "Premium",
                price: 299000,
                billingCycle: "monthly",
                description: "Giải pháp toàn diện cho studio chuyên nghiệp",
                features: [
                    "Không giới hạn booking",
                    "5 chi nhánh",
                    "Báo cáo chi tiết & analytics",
                    "Hỗ trợ 24/7",
                    "50GB lưu trữ",
                    "Tích hợp thanh toán đầy đủ",
                    "API access",
                    "Custom branding",
                    "Backup tự động",
                    "Multi-user access",
                ],
                limitations: [],
            },
        ],
    }
}

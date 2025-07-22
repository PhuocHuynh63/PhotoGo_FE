import { ISubscriptionPlanModel } from "@models/subcription_plan/common.model";

// Mock data for testing the subscription settings page
export const mockSubscriptionData: ISubscriptionPlanModel[] = [
  {
    id: "1",
    name: "Gói Cơ Bản Người Dùng",
    description: "Gói cơ bản dành cho người dùng thông thường",
    priceForMonth: 99000,
    priceForYear: 990000,
    isActive: true,
    planType: "user",
    billingCycle: "monthly",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Gói Premium Người Dùng",
    description: "Gói premium với nhiều tính năng nâng cao",
    priceForMonth: 199000,
    priceForYear: 1990000,
    isActive: true,
    planType: "user",
    billingCycle: "yearly",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "3",
    name: "Gói Cơ Bản Nhà Cung Cấp",
    description: "Gói cơ bản dành cho nhà cung cấp dịch vụ",
    priceForMonth: 299000,
    priceForYear: 2990000,
    isActive: true,
    planType: "vendor",
    billingCycle: "monthly",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "4",
    name: "Gói Pro Nhà Cung Cấp",
    description: "Gói chuyên nghiệp cho nhà cung cấp lớn",
    priceForMonth: 499000,
    priceForYear: 4990000,
    isActive: false,
    planType: "vendor",
    billingCycle: "yearly",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "5",
    name: "Gói Thử Nghiệm",
    description: "Gói thử nghiệm miễn phí trong 30 ngày",
    priceForMonth: 0,
    isActive: false,
    planType: "basic",
    billingCycle: "one-time",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  }
];

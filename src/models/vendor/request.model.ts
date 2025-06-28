import { z } from "zod";
import { LocationModel } from "@models/location/common.model";

/**
 * VendorCreateRequestModel là schema cho request tạo mới vendor
 */
/**
 * LocationCreateRequestModel is a lenient schema for location data during vendor creation.
 * It only requires fields that the user provides through the form.
 */
const LocationCreateRequestModel = z.object({
  province: z.string().min(1, "Tỉnh/Thành phố không được để trống"),
  district: z.string().min(1, "Quận/Huyện không được để trống"),
  ward: z.string().min(1, "Phường/Xã không được để trống"),
  address: z.string().min(1, "Địa chỉ chi tiết không được để trống"),
  // The following fields are not required from the user at creation time
  id: z.string().optional(),
  city: z.string().optional(), // Backend requires this, will be added during submission
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const VendorCreateRequestModel = z.object({
  name: z.string().min(1, "Tên nhà cung cấp không được để trống"),
  category_id: z.string().min(1, "Danh mục không được để trống"),
  user_id: z.string().min(1, "User ID không được để trống"),
  description: z.string().optional(),
  status: z.enum(["hoạt động", "không hoạt động", "tạm ngưng"]).optional().default("hoạt động"),
  locations: z.array(LocationCreateRequestModel).optional(),
  logo: z.any().optional(),
  banner: z.any().optional(),
});

export type IVendorCreateRequest = z.infer<typeof VendorCreateRequestModel>;
//----------------------End----------------------//

/**
 * VendorListRequestModel là schema cho request lấy danh sách vendor (admin filter)
 */
export const VendorListRequestModel = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  status: z.string().optional(),
  minBranches: z.number().optional(),
  maxBranches: z.number().optional(),
  minPackages: z.number().optional(),
  maxPackages: z.number().optional(),
  minOrders: z.number().optional(),
  maxOrders: z.number().optional(),
  minRating: z.number().optional(),
  maxRating: z.number().optional(),
  minPriority: z.number().optional(),
  maxPriority: z.number().optional(),
  joinDateFrom: z.string().optional(),
  joinDateTo: z.string().optional(),
  category: z.string().optional(),
  hasLogo: z.boolean().optional(),
  current: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  sortBy: z.enum([
    "createdAt",
    "updatedAt",
    "name",
    "category",
    "priority",
    "order_count",
    "package_count",
    "branch_count"
  ]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
});

export type IVendorListRequest = z.infer<typeof VendorListRequestModel>;
//----------------------End----------------------//

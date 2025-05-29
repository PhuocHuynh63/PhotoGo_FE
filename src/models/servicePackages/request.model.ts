import { z } from "zod";

/**
 * ServicePackageRequest is a Model for Service Package request
 * @param name - Name of service package
 * @param description - Description of service package
 * @param vendorId - ID of vendor
 * @param status - Status of service package
 * @param image - Image of service package (optional)
 */
export const ServicePackageRequest = z.object({
    name: z.string().min(1, 'Tên gói dịch vụ không được bỏ trống'),
    description: z.string().min(1, 'Mô tả không được bỏ trống'),
    vendorId: z.string().min(1, 'Vendor ID không được bỏ trống'),
    status: z.string().min(1, 'Trạng thái không được bỏ trống'),
    image: z.instanceof(File).optional()
})

export type IServicePackageRequest = z.TypeOf<typeof ServicePackageRequest>;

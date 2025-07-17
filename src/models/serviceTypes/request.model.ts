import { z } from "zod";

export const ServiceTypeRequest = z.object({
    name: z.string().min(1, 'Tên gói dịch vụ không được bỏ trống'),
    description: z.string().min(1, 'Mô tả không được bỏ trống'),
    status: z.enum(['hoạt động', 'không hoạt động'])
})

export type IServiceTypeRequest = z.TypeOf<typeof ServiceTypeRequest>


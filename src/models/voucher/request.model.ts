import { z } from "zod";

// Base schema for common fields
const baseVoucherSchema = z.object({
  code: z
    .string()
    .min(1, "Mã voucher là bắt buộc")
    .max(20, "Mã voucher không được quá 20 ký tự")
    .regex(/^[A-Z0-9]+$/, "Mã voucher chỉ được chứa chữ hoa và số"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  discount_type: z.enum(["phần trăm", "cố định"], {
    required_error: "Vui lòng chọn loại giảm giá",
  }),
  discount_value: z.string().min(1, "Giá trị giảm là bắt buộc"),
  minPrice: z.coerce.number().min(0, "Giá tối thiểu không được âm").optional(),
  maxPrice: z.coerce.number().min(0, "Giá tối đa không được âm").optional(),
  quantity: z.coerce.number().min(1, "Số lượng phải lớn hơn 0").max(1000000, "Số lượng không được quá 1,000,000"),
  start_date: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
  end_date: z.string().min(1, "Ngày kết thúc là bắt buộc"),
});

// Refinement logic as a reusable function
const refineVoucherData = (schema: z.ZodType<any, any, any>) => {
  return schema
    .refine(
      (data) => {
        return new Date(data.end_date) > new Date(data.start_date);
      },
      {
        message: "Ngày kết thúc phải sau ngày bắt đầu",
        path: ["end_date"],
      }
    )
    .refine(
      (data) => {
        if (typeof data.minPrice === 'number' && typeof data.maxPrice === 'number') {
          return data.maxPrice >= data.minPrice;
        }
        return true;
      },
      {
        message: "Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu",
        path: ["maxPrice"],
      }
    )
    .refine(
      (data) => {
        if (data.discount_type === "phần trăm") {
          const value = parseFloat(data.discount_value);
          return !isNaN(value) && value > 0 && value <= 100;
        }
        return true;
      },
      {
        message: "Giá trị giảm phần trăm phải từ 1 đến 100",
        path: ["discount_value"],
      }
    )
    .refine(
      (data) => {
        if (data.discount_type === "cố định") {
          const value = parseFloat(data.discount_value);
          return !isNaN(value) && value > 0;
        }
        return true;
      },
      {
        message: "Giá trị giảm cố định phải là một số lớn hơn 0",
        path: ["discount_value"],
      }
    );
};

// Schema for creating a voucher
export const createVoucherSchema = refineVoucherData(baseVoucherSchema);
export type ICreateVoucher = z.TypeOf<typeof createVoucherSchema>;

// Schema for editing a voucher
export const editVoucherSchema = refineVoucherData(
  baseVoucherSchema.extend({
    status: z.string().min(1, "Trạng thái là bắt buộc"),
  })
);
export type IEditVoucher = z.TypeOf<typeof editVoucherSchema>;



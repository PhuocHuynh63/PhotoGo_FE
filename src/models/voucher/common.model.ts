import { UserModel } from "@models/user/common.model";
import { z } from "zod";

export const VoucherModel = z.object({
    id: z.string(),
    code: z.string(),
    description: z.string(),
    discount_type: z.string(),
    discount_value: z.string(),
    minPrice: z.number(),
    maxPrice: z.number(),
    quantity: z.number(),
    usedCount: z.number(),
    type: z.string(),
    point: z.number(),
    start_date: z.string(),
    end_date: z.string(),
    status: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});


export type IVoucher = z.TypeOf<typeof VoucherModel>;


export const VoucherFromPointModel = z.object({

    assigned_at: z.string(),
    is_valid: z.boolean(),
    status: z.string(),
    used_at: z.string(),
    user: UserModel,
    user_id: z.string(),
    voucher: VoucherModel,
    voucher_id: z.string(),
});

export type IVoucherFromPoint = z.TypeOf<typeof VoucherFromPointModel>;

export const VoucherFromCampaignModel = z.object({

    assigned_at: z.string(),
    is_valid: z.boolean(),
    status: z.string(),
    used_at: z.string(),
    user: UserModel,
    user_id: z.string(),
    voucher: VoucherModel,
    voucher_id: z.string(),
});

export type IVoucherFromCampaign = z.TypeOf<typeof VoucherFromCampaignModel>;






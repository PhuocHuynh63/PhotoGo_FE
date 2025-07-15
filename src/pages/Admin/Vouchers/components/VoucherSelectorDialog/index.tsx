"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@components/Atoms/ui/dialog";
import { Gift, Percent, DollarSign, Star, BadgePercent } from "lucide-react";
import React from "react";

const voucherTypes = [
  {
    discount_type: "phần trăm",
    voucher_type: "tiền",
    title: "Giảm % - Tiền",
    description: "Voucher giảm theo phần trăm, khách hàng sử dụng miễn phí",
    icon: <Percent className="text-blue-500 text-4xl" />,
  },
  {
    discount_type: "cố định",
    voucher_type: "tiền",
    title: "Giảm cố định - Tiền",
    description: "Voucher giảm số tiền cố định, khách hàng sử dụng miễn phí",
    icon: <DollarSign className="text-green-500 text-4xl" />,
  },
  {
    discount_type: "phần trăm",
    voucher_type: "điểm",
    title: "Giảm % - Đổi điểm",
    description: "Voucher giảm theo phần trăm, khách hàng cần điểm để đổi",
    icon: <Star className="text-purple-500 text-4xl" />,
  },
  {
    discount_type: "cố định",
    voucher_type: "điểm",
    title: "Giảm cố định - Đổi điểm",
    description: "Voucher giảm số tiền cố định, khách hàng cần điểm để đổi",
    icon: <BadgePercent className="text-orange-500 text-4xl" />,
  },
];

interface VoucherTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (discountType: "phần trăm" | "cố định", voucherType: "điểm" | "tiền") => void;
}

export function VoucherTypeSelector({ open, onOpenChange, onSelect }: VoucherTypeSelectorProps) {
  const [selected, setSelected] = React.useState<number | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-blue-600" />
            Chọn loại voucher
          </DialogTitle>
          <DialogDescription>
            Chọn loại voucher bạn muốn tạo. Mỗi loại có đặc điểm và mục đích sử dụng khác nhau.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {voucherTypes.map((type, idx) => (
            <div
              key={idx}
              className={`group relative cursor-pointer rounded-2xl border-2 bg-white p-6 shadow-md transition-all duration-200 flex flex-col gap-3 min-h-[220px] 
                ${selected === idx ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent'}
                hover:scale-105 hover:shadow-xl hover:border-blue-500 active:scale-100`}
              onClick={() => {
                setSelected(idx);
                setTimeout(() => onSelect(type.discount_type as any, type.voucher_type as any), 150);
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                {type.icon}
                <span className="text-xl font-bold">{type.title}</span>
              </div>
              <div className="text-gray-600 mb-2">{type.description}</div>
            
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-transform group-hover:translate-x-2 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

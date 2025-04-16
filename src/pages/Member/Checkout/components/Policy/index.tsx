'use client'

import { Info } from 'lucide-react'
import React from 'react'

const Policy = () => {
    return (
        <div className="bg-primary-opacity border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex gap-2">
                <Info className="h-5 w-5 text-" />
                <p className="text-sm">
                    <span className="font-medium">Chính sách đặt lịch:</span> Khi đặt dịch vụ studio, bạn cần đặt cọc
                    trước một phần để xác nhận lịch hẹn. Số tiền còn lại sẽ được thanh toán vào ngày thực hiện dịch vụ.
                </p>
            </div>
        </div>
    )
}

export default Policy
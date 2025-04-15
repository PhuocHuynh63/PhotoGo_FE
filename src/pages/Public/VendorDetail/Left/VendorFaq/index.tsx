'use client'

import { useVendor } from '@lib/vendorContext'
import React from 'react'

const VendorFaq = () => {
  const studioData = useVendor() as any
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Câu hỏi thường gặp</h2>
      <div className="space-y-4">
        {studioData.faqs.map((faq: any, index: number) => (
          <div key={index} className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default VendorFaq
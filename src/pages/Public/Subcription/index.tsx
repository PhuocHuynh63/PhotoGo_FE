'use client'

import React, { useState } from 'react'
import { Camera, Mountain, Zap } from 'lucide-react'
import TitlePricing from './components/Title'
import SelectionPricing from './components/Selection'
import PricingPackage from '@components/Organisms/PricingPackages'

const PricingPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<'month' | 'session'>('month')

  const packageListData = [
    {
      name: 'Studio Basic',
      description: 'Lý tưởng cho ảnh chân dung và sản phẩm cơ bản.',
      icon: <Camera className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1599842057874-37393e9342df?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640',
      features: ['2 giờ chụp trong studio', '20 ảnh đã chỉnh sửa', '2 phông nền tùy chọn', 'Tư vấn trang phục'],
      recommended: false,
    },
    {
      name: 'Studio Premium',
      description: 'Sự lựa chọn tốt nhất cho nhu cầu chuyên nghiệp.',
      icon: <Zap className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640',
      features: ['3 giờ chụp trong studio', '50 ảnh đã chỉnh sửa', '4 phông nền tùy chọn', 'Tư vấn trang phục', 'Hỗ trợ trang điểm'],
      recommended: true,
    },
    {
      name: 'Studio Deluxe',
      description: 'Gói toàn diện cho các dự án lớn.',
      icon: <Mountain className="h-6 w-6" />,
      imageUrl: 'https://images.unsplash.com/photo-1616041624447-5d0a643194a2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640',
      features: ['4 giờ chụp trong studio', '100 ảnh đã chỉnh sửa', '6 phông nền tùy chọn', 'Tư vấn trang phục', 'Hỗ trợ trang điểm', 'Album ảnh in chất lượng cao'],
      recommended: false,
    },
  ]

  const monthlyPackages = packageListData.map(p => ({ ...p, price: p.name === 'Studio Basic' ? '799.000₫' : p.name === 'Studio Premium' ? '1.499.000₫' : '2.499.000₫', unit: '/tháng' }))
  const sessionPackages = packageListData.map(p => ({ ...p, price: p.name === 'Studio Basic' ? '899.000₫' : p.name === 'Studio Premium' ? '1.699.000₫' : '2.799.000₫', unit: '/buổi' }))

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen w-full relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-10 pointer-events-none"
      >
        <div className="blur-[120px] h-56 bg-gradient-to-br from-indigo-200 to-purple-200" />
        <div className="blur-[120px] h-32 bg-gradient-to-r from-cyan-200 to-blue-200" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        <TitlePricing />
        <SelectionPricing selected={selectedMethod} setSelected={setSelectedMethod} />
        <PricingPackage subscriptions={selectedMethod === 'month' ? monthlyPackages : sessionPackages} />
      </div>
    </div>
  )
}

export default PricingPage
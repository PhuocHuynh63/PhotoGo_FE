'use client'

import React, { useState } from 'react'
import { cn } from '@helpers/CN'
import Image from 'next/image'
import { Camera, Check, Palette, Star } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@components/Atoms/Card'
import Button from '@components/Atoms/Button'

const PricingPackage = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    return (
        <div className="flex justify-center bg-white">
            <div className="px-4 md:px-6">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Gói 1: Studio Photography */}
                    <Card
                        className={cn(
                            "relative flex flex-col border border-gray-200 transition-all duration-300 overflow-hidden",
                            hoveredCard === 0 ? "shadow-lg" : "shadow-sm",
                        )}
                        onMouseEnter={() => setHoveredCard(0)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div className="absolute top-0 w-full h-1 bg-primary"></div>

                        <CardHeader className="pb-6 pt-8">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                    <Camera className="h-5 w-5 text-gray-700" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Studio Basic</h3>
                                    <p className="text-gray-500 text-sm">Chụp ảnh cơ bản trong studio</p>
                                </div>
                            </div>
                            <div className="w-[320px] flex justify-center items-center overflow-hidden rounded-md">

                            </div>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold tracking-tight text-gray-900">799.000₫</span>
                                <span className="ml-1 text-sm text-gray-500">/buổi</span>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1">
                            <ul className="space-y-3">
                                <li className="flex items-center">
                                    <Check className="h-4 w-4 text-gray-700 mr-3 flex-shrink-0" />
                                    <span className="text-gray-700">2 giờ chụp trong studio</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-4 w-4 text-gray-700 mr-3 flex-shrink-0" />
                                    <span className="text-gray-700">20 ảnh đã chỉnh sửa</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-4 w-4 text-gray-700 mr-3 flex-shrink-0" />
                                    <span className="text-gray-700">2 phông nền tùy chọn</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-4 w-4 text-gray-700 mr-3 flex-shrink-0" />
                                    <span className="text-gray-700">Tư vấn trang phục</span>
                                </li>
                            </ul>
                        </CardContent>

                        <CardFooter className="pt-4 pb-8">
                            <Button className="w-full text-white">Mua ngay</Button>
                        </CardFooter>
                    </Card>

                </div>

                <div className="mt-16 border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto shadow-sm">
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Ưu đãi đặc biệt</h3>
                        <p className="text-gray-600">Giảm 15% cho đặt lịch trong tháng này. Áp dụng cho tất cả các gói dịch vụ.</p>
                        <div className="pt-4">
                            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6">Liên hệ tư vấn ngay</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PricingPackage
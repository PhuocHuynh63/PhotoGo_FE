'use client'

import React, { useState } from 'react'
import { cn } from '@helpers/CN'
import { Camera, Check } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@components/Atoms/Card'
import Button from '@components/Atoms/Button'


const PricingPackage = ({
    subscriptions,
    numberOfPackages = 3,
}: ICOMPONENTS.PricingPackage) => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    return (
        <div className="flex justify-center bg-white">
            <div className="px-4 md:px-6">
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {subscriptions.slice(0, numberOfPackages).map((pkg: any, index: number) => (
                        <Card
                            key={index}
                            className={cn(
                                "relative flex flex-col border border-gray-200 transition-all duration-300 overflow-hidden",
                                hoveredCard === index ? "shadow-lg" : "shadow-sm",
                            )}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="absolute top-0 w-full h-1 bg-primary" />

                            <CardHeader className="pb-6 pt-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                                        {pkg.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                                        <p className="text-gray-500 text-sm">{pkg.description}</p>
                                    </div>
                                </div>

                                <div className="w-[320px] flex justify-center items-center overflow-hidden rounded-md">
                                    {/* Image placeholder */}
                                </div>

                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold tracking-tight text-gray-900">
                                        {pkg.price}
                                    </span>
                                    <span className="ml-1 text-sm text-gray-500">{pkg.unit}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {pkg.features.map((feature: any, i: number) => (
                                        <li key={i} className="flex items-center">
                                            <Check className="h-4 w-4 text-gray-700 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="pt-4 pb-8">
                                <Button className="w-full text-white">Mua ngay</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PricingPackage
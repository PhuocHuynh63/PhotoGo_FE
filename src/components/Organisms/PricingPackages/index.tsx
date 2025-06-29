'use client'

import React from 'react'
import { cn } from '@helpers/CN'
import { Check } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@components/Atoms/Card'
import Button from '@components/Atoms/Button'

// Giả sử ICOMPONENTS.PricingPackage được định nghĩa ở nơi khác
// interface IPricingPackageProps {
//   subscriptions: any[];
//   numberOfPackages?: number;
// }

const PricingPackage = ({
    subscriptions,
    numberOfPackages = 3,
}: any /* ICOMPONENTS.PricingPackage */) => {

    return (
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
            {subscriptions.slice(0, numberOfPackages).map((pkg: any, index: number) => (
                <Card
                    key={index}
                    className={cn(
                        "relative flex flex-col rounded-2xl transition-all duration-300",
                        // Logic để làm nổi bật thẻ được đề xuất
                        pkg.recommended
                            ? "bg-slate-900 text-white shadow-2xl scale-105"
                            : "bg-white text-slate-900 shadow-lg hover:shadow-xl"
                    )}
                >
                    {/* Badge "Phổ biến nhất" */}
                    {pkg.recommended && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase">
                                Phổ biến nhất
                            </div>
                        </div>
                    )}

                    <CardHeader className="p-8">
                        {/* Hình ảnh minh họa */}
                        <div className="w-full h-40 mb-6 rounded-lg overflow-hidden">
                            <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex items-center gap-4 mb-2">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", pkg.recommended ? 'bg-primary text-white' : 'bg-slate-100 text-primary')}>
                                {pkg.icon}
                            </div>
                            <h3 className="text-2xl font-bold">{pkg.name}</h3>
                        </div>

                        <p className={cn("text-sm min-h-[40px]", pkg.recommended ? "text-slate-300" : "text-slate-600")}>
                            {pkg.description}
                        </p>

                        <div className="flex items-baseline mt-4">
                            <span className="text-4xl font-extrabold tracking-tight">
                                {pkg.price}
                            </span>
                            <span className={cn("ml-2 text-sm", pkg.recommended ? "text-slate-400" : "text-slate-500")}>
                                {pkg.unit}
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 pt-0 flex-1">
                        <ul className="space-y-4">
                            {pkg.features.map((feature: any, i: number) => (
                                <li key={i} className="flex items-center">
                                    <Check className={cn("h-5 w-5 mr-3 flex-shrink-0", pkg.recommended ? "text-primary" : "text-slate-500")} />
                                    <span className={cn(pkg.recommended ? "text-slate-200" : "text-slate-700")}>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>

                    <CardFooter className="p-8 pt-4">
                        <Button
                            className={cn(
                                "w-full py-3 text-base font-semibold transition-transform duration-300 hover:scale-105",
                                // Logic cho nút CTA
                                pkg.recommended
                                    ? "bg-primary text-white hover:bg-primary/90"
                                    : "bg-white text-primary border-2 border-primary hover:bg-primary/10"
                            )}
                        >
                            Chọn Gói Này
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default PricingPackage
'use client'

import React, { useState } from 'react'
import { cn } from '@helpers/CN'
import { Card, CardContent, CardFooter, CardHeader } from '@components/Atoms/Card'
import Button from '@components/Atoms/Button'
import PaymentModal from '@pages/Public/Subcription/components/ModalPayment'
import { Check, Star, Zap, Crown, Camera } from 'lucide-react'
import { formatPrice } from '@utils/helpers/CurrencyFormat/CurrencyFormat'
import { useSession } from '@stores/user/selectors'
import { METADATA } from '../../../types/IMetadata'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@routes'

interface SubscriptionData {
    id: string;
    name: string;
    description: string;
    price: string;
    priceForMonth: string;
    priceForYear: string;
    unit: string;
    billingCycle: string;
    planType: string;
    isActive: boolean;
    recommended: boolean;
    imageUrl?: string;
    icon?: React.ReactNode;
    createdAt: string;
    updatedAt: string;
}

interface PricingPackageProps {
    subscriptions: SubscriptionData[];
    numberOfPackages?: number;
}

const PricingPackage = ({
    subscriptions,
    numberOfPackages = 3,
}: PricingPackageProps) => {
    const router = useRouter();
    const session = useSession() as METADATA.ISession;

    const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionData | null>(null);

    /**
     * Handle open modal
     */
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const handleOpenModal = (subscription: SubscriptionData) => {
        setSelectedSubscription(subscription);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedSubscription(null);
    };
    //------------------------------End------------------------------//

    /**
     * Handle manage subscription
     */
    const handleManageSubscription = () => {
        router.push(ROUTES.USER.PROFILE.SUBSCRIPTION);
    }
    //------------------------------End------------------------------//

    // Icon mapping for different plan types
    const getPlanIcon = (planType: string) => {
        switch (planType) {
            case 'người dùng':
                return <Camera className="w-5 h-5" />;
            case 'vendor':
                return <Crown className="w-5 h-5" />;
            default:
                return <Zap className="w-5 h-5" />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 max-w-7xl mx-auto items-stretch px-4 sm:px-6 lg:px-8">
            {subscriptions.slice(0, numberOfPackages).map((pkg: SubscriptionData, index: number) => (
                <Card
                    key={index}
                    className={cn(
                        "relative flex flex-col rounded-2xl transition-all duration-300 hover:shadow-2xl",
                        "min-h-[600px] w-full lg:w-1/3",
                        // Logic để làm nổi bật thẻ được đề xuất
                        pkg.recommended
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl scale-105 border-0"
                            : "bg-white text-slate-900 shadow-lg border border-gray-100 hover:border-blue-200"
                    )}
                >
                    {/* Badge "Phổ biến nhất" */}
                    {pkg.recommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-6 py-2 rounded-full uppercase tracking-wide shadow-lg flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                Phổ biến nhất
                            </div>
                        </div>
                    )}

                    <CardHeader className="p-6 lg:p-8">
                        {/* Header with icon and name */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                                pkg.recommended
                                    ? 'bg-white/20 text-white'
                                    : 'bg-blue-50 text-blue-600'
                            )}>
                                {pkg.icon || getPlanIcon(pkg.planType)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl lg:text-2xl font-bold">{pkg.name}</h3>
                                <p className="text-sm opacity-80 mt-1">
                                    {pkg.planType} • {pkg.billingCycle}
                                </p>
                            </div>
                        </div>

                        {/* Price section */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className={cn(
                                    "text-3xl lg:text-4xl font-extrabold tracking-tight",
                                    pkg.recommended ? "text-white" : "text-gray-900"
                                )}>
                                    {pkg.price}
                                </span>
                                <span className={cn(
                                    "text-sm font-medium",
                                    pkg.recommended ? "text-white/80" : "text-gray-500"
                                )}>
                                    {pkg.unit}
                                </span>
                            </div>
                            {pkg.priceForYear && (
                                <p className={cn(
                                    "text-sm mt-1",
                                    pkg.recommended ? "text-white/70" : "text-gray-400"
                                )}>
                                    Tiết kiệm {formatPrice(Number(pkg.priceForYear))} /năm
                                </p>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 lg:p-8 pt-0 flex-1">
                        {/* Features list - parse from description */}
                        <div className="space-y-3">
                            {pkg.description && (() => {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(pkg.description, 'text/html');
                                const listItems = doc.querySelectorAll('li');
                                return Array.from(listItems).map((li, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Check className={cn(
                                            "h-5 w-5 mt-0.5 flex-shrink-0",
                                            pkg.recommended ? "text-white" : "text-green-500"
                                        )} />
                                        <span className={cn(
                                            "text-sm leading-relaxed",
                                            pkg.recommended ? "text-white/90" : "text-gray-700"
                                        )}>
                                            {li.textContent}
                                        </span>
                                    </div>
                                ));
                            })()}
                        </div>
                    </CardContent>

                    <CardFooter className="p-6 lg:p-8 pt-0">
                        {session?.user?.subscriptionId ? (
                            <Button
                                className={cn(
                                    "w-full py-3 lg:py-4 text-sm lg:text-base font-semibold transition-all duration-300",
                                    "hover:scale-105 focus:outline-none focus:ring-4",
                                    pkg.recommended
                                        ? "bg-white text-blue-600 hover:bg-gray-50 focus:ring-white/20 shadow-lg"
                                        : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 shadow-lg"
                                )}
                                onClick={handleManageSubscription}
                            >
                                Quản lý gói dịch vụ của bạn
                            </Button>
                        ) : (
                            <Button
                                className={cn(
                                    "w-full py-3 lg:py-4 text-sm lg:text-base font-semibold transition-all duration-300",
                                    "hover:scale-105 focus:outline-none focus:ring-4",
                                    pkg.recommended
                                        ? "bg-white text-blue-600 hover:bg-gray-50 focus:ring-white/20 shadow-lg"
                                        : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 shadow-lg"
                                )}
                                onClick={() => handleOpenModal(pkg)}
                            >
                                Chọn Gói Này
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}

            {selectedSubscription && (
                <PaymentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    subscription={selectedSubscription}
                />
            )}
        </div>
    )
}

export default PricingPackage
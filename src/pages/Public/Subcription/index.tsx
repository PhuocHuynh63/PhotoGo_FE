'use client'

import React, { useEffect, useState } from 'react'
import { Camera, Zap } from 'lucide-react'
import TitlePricing from './components/Title'
import SelectionPricing from './components/Selection'
import PricingPackage from '@components/Organisms/PricingPackages'
import { subscriptionService } from '@services/subcription'
import { SUBSCRIPTION } from '@constants/subscriptions'
import { formatPrice } from '@utils/helpers/CurrencyFormat/CurrencyFormat'

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month')
  const [packages, setPackages] = useState<any[]>([])

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const params = {
          isActive: true,
          planType: SUBSCRIPTION.PLAN_TYPE.MEMBERSHIP,
        }

        const response = await subscriptionService.getSubscriptionPlans(params) as any

        const uiDataMap: { [key: string]: any } = {
          'Membership': {
            icon: <Zap className="h-6 w-6" />,
            imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640',
            recommended: true,
          },
          'Default': {
            icon: <Camera className="h-6 w-6" />,
            imageUrl: 'https://images.unsplash.com/photo-1599842057874-37393e9342df?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640',
            recommended: false,
          }
        };

        const formattedPackages = (response.data || [response]).map((plan: any) => ({
          ...plan,
          ...(uiDataMap[plan.name] || uiDataMap['Default'])
        }));

        setPackages(formattedPackages)
      } catch (err) {
        console.error("Failed to fetch subscription plans:", err)
        setPackages([])
      }
    }

    fetchSubscriptions()
  }, [])

  const displayPackages = packages.map(pkg => ({
    ...pkg,
    price: billingCycle === 'month' ? formatPrice(pkg.priceForMonth) : formatPrice(pkg.priceForYear),
    unit: billingCycle === 'month' ? '/ tháng' : '/ năm',
  }))

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
        <SelectionPricing selected={billingCycle} setSelected={setBillingCycle} />
        <PricingPackage subscriptions={displayPackages} />
      </div>
    </div>
  )
}

export default PricingPage
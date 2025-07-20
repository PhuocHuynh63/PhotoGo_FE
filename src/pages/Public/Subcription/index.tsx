'use client'

import React, { useEffect, useState } from 'react'
import { Camera, Zap } from 'lucide-react'
import TitlePricing from './components/Title'
import SelectionPricing from './components/Selection'
import PricingPackage from '@components/Organisms/PricingPackages'
import { subscriptionService } from '@services/subcription' // Assuming this path is correct
import { SUBSCRIPTION } from '@constants/subscriptions' // Assuming this path is correct

// --- Helper Functions ---

/**
 * Parses features from an HTML string (e.g., "<ul><li>Feature 1</li>...</ul>").
 * @param {string} htmlString - The HTML string to parse.
 * @returns {string[]} An array of feature strings.
 */
// const parseFeaturesFromHTML = (htmlString: string): string[] => {
//   if (!htmlString || typeof htmlString !== 'string') return []
//   const doc = new DOMParser().parseFromString(htmlString, 'text/html')
//   return Array.from(doc.querySelectorAll('li')).map(li => li.textContent || '')
// }

/**
 * Formats a numeric string into Vietnamese currency format.
 * @param {string | number} amount - The numeric value.
 * @returns {string} Formatted currency string (e.g., "29.000 ₫").
 */
const formatCurrency = (amount: string | number): string => {
  const number = Number(amount)
  if (isNaN(number)) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

// --- Main Component ---

const PricingPage = () => {
  // State to manage billing cycle selection ('month' or 'year')
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month')
  // State to store subscription plans fetched from the API
  const [packages, setPackages] = useState<any[]>([])

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const params = {
          isActive: true,
          planType: SUBSCRIPTION.PLAN_TYPE.MEMBERSHIP,
          current: 1,
          pageSize: 10,
          name: '',
          sortBy: 'price',
          sortDirection: 'asc',
        }
        // Assuming the service returns an object with a data array, e.g., { data: [...] }
        const response = await subscriptionService.getSubscriptionPlans(params) as any

        // --- This mapping adds UI-specific details to your API data ---
        const uiDataMap: { [key: string]: any } = {
          'Membership': {
            icon: <Zap className="h-6 w-6" />,
            imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640',
            recommended: true,
          },
          // You can add other plans here if your API returns more
          'Default': {
            icon: <Camera className="h-6 w-6" />,
            imageUrl: 'https://images.unsplash.com/photo-1599842057874-37393e9342df?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640',
            recommended: false,
          }
        };

        // Assuming response.data is the array of subscription plans
        const formattedPackages = (response.data || [response]).map((plan: any) => ({
          ...plan,
          ...(uiDataMap[plan.name] || uiDataMap['Default'])
        }));

        setPackages(formattedPackages)
      } catch (err) {
        console.error("Failed to fetch subscription plans:", err)
        setPackages([]) // Clear packages on error
      }
    }

    fetchSubscriptions()
  }, [])

  // Prepare packages to be displayed based on the selected billing cycle
  const displayPackages = packages.map(pkg => ({
    ...pkg,
    price: billingCycle === 'month' ? formatCurrency(pkg.priceForMonth) : formatCurrency(pkg.priceForYear),
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
        {/* Pass the dynamically generated packages to the display component */}
        <PricingPackage subscriptions={displayPackages} />
      </div>
    </div>
  )
}

export default PricingPage
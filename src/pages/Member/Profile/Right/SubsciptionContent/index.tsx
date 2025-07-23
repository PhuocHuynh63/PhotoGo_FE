// src/components/SubscriptionContent.tsx

'use client'

import React from 'react'
import { Calendar, CreditCard } from 'lucide-react'

import { Button } from '@components/Atoms/ui/button'
import { Card, CardContent } from '@components/Atoms/ui/card'
import { Badge } from '@components/Atoms/ui/badge'

import { IUser } from '@models/user/common.model'
import { useSubscriptionHistory } from '@utils/hooks/useSubscription'

import { formatPrice } from '@utils/helpers/CurrencyFormat/CurrencyFormat'
import { formatDate } from '@utils/helpers/Date'
import StatsSummary from '../components/StatsSummary'


const SubscriptionContent = ({ user }: { user: IUser }) => {
  // const hasSubscription = Boolean(user?.subscription)

  const { subscriptionHistory, pagination, fetchSubscriptionHistory } = useSubscriptionHistory({ userId: user?.id })
  console.log(subscriptionHistory);


  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'hoạt động':
        return 'border-green-500'
      case 'hết hạn':
        return 'border-yellow-500'
      case 'đã huỷ':
        return 'border-red-500'
      default:
        return 'border-gray-300'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hoạt động':
        return <Badge variant="outline">Hoạt động</Badge>
      case 'hết hạn':
        return <Badge variant="secondary">Hết hạn</Badge>
      case 'đã huỷ':
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleRetryPayment = (paymentOSId: string) => {
    window.open(`https://pay.payos.vn/web/${paymentOSId}`, '_blank')
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Lịch sử subscription</h3>
          <p className="text-sm text-gray-500">
            Tổng cộng {pagination.totalItem} giao dịch
          </p>
        </div>

        <StatsSummary subscriptionHistory={subscriptionHistory} />

        <div className="space-y-4">
          {subscriptionHistory?.map((subscription) => {
            const amount = subscription?.historyDetails[0]?.metadata?.amount ?? 0 as number

            return (
              <React.Fragment key={subscription.plan.id}>
                <Card className={`border - l - 4 ${getStatusBorderColor(subscription.subscription.status)
                  }`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex-grow space-y-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">Gói {subscription.plan?.name}</h4>
                          {getStatusBadge(subscription.subscription.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {formatDate(subscription.subscription.startDate)} - {formatDate(subscription.subscription.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">PayOS</span>
                          </div>
                          <div className="flex items-center gap-2 md:col-span-2">
                            <span className="text-gray-500">Mã GD: {subscription.historyDetails[0]?.id}</span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          Chu kỳ: {subscription.subscription.billingCycle === 'hàng tháng' ? 'Hàng tháng' : 'Hàng năm'}
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <div className="text-2xl font-bold text-orange-400">{formatPrice(Number(amount))}</div>
                        {(subscription.subscription.status === 'chờ thanh toán') && (
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-orange-400 hover:bg-orange-600"
                            onClick={() => handleRetryPayment(subscription.payment)}
                          >
                            Tiếp tục thanh toán
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </React.Fragment>
            )
          })}
        </div>

        {/* "Load More" button for pagination. Renders only if there are more pages. */}
        {pagination.current < pagination.totalPage && (
          <div className="flex justify-center pt-4">
            <Button onClick={() => fetchSubscriptionHistory()} variant="outline">
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default SubscriptionContent
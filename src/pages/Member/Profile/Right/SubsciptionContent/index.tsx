'use client'

import Subscription from '@components/Atoms/Subscription'
import { Button } from '@components/Atoms/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/Atoms/ui/card'
import { IUser } from '@models/user/common.model'
import { formatPrice } from '@utils/helpers/CurrencyFormat/CurrencyFormat'
import { formatDate } from '@utils/helpers/Date'
import { Calendar, CreditCard } from 'lucide-react'
import React from 'react'

const SubscriptionContent = ({ user }: { user: IUser }) => {

  const hasSubscription = Boolean(user?.subscription)

  return (
    <>
      <Subscription hasSubscription={hasSubscription} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Lịch sử subscription</h3>
          <p className="text-sm text-gray-500">Tổng cộng {history.length} giao dịch</p>
        </div>

        <div className="space-y-4">
          {history.map((subscription, index) => (
            <Card key={subscription.id} className={`border-l-4 ${getPlanColor(subscription.planType)}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg">{getPlanIcon(subscription.planType)}</div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg">Gói {subscription.planName}</h4>
                        {getStatusBadge(subscription.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{subscription.paymentMethod}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Mã GD: {subscription.transactionId}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        Chu kỳ: {subscription.billingCycle === "monthly" ? "Hàng tháng" : "Hàng năm"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="text-2xl font-bold text-orange-600">{formatPrice(subscription.price)}</div>

                    <div className="flex gap-2">
                      {subscription.status === "active" && <Button size="sm">Quản lý</Button>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default SubscriptionContent
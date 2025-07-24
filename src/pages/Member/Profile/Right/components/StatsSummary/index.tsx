import { Card, CardContent, CardHeader, CardTitle } from '@components/Atoms/ui/card'
import { ISubscriptionHistoryModel } from '@models/subscription/response.model'
import { formatPrice } from '@utils/helpers/CurrencyFormat/CurrencyFormat'
import React from 'react'

const StatsSummary = ({ subscriptionHistory }: { subscriptionHistory: ISubscriptionHistoryModel[] }) => {

    return (
        <>
            {/* Summary Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thống kê tổng quan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{subscriptionHistory?.length}</div>
                            <div className="text-sm text-gray-500">Tổng giao dịch</div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {subscriptionHistory?.filter((sub) => sub?.subscription?.status === "hoạt động")?.length}
                            </div>
                            <div className="text-sm text-gray-500">Đang hoạt động</div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {formatPrice(subscriptionHistory?.reduce((sum, sub) => sum + sub?.plan?.priceForMonth, 0))}
                            </div>
                            <div className="text-sm text-gray-500">Tổng chi phí</div>
                        </div>

                        {/* <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {Math.round(subscriptionHistory.reduce((sum, sub) => sum + sub.plan.priceForMonth, 0) / subscriptionHistory.length)}
                            </div>
                            <div className="text-sm text-gray-500">Chi phí TB/tháng</div>
                        </div> */}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default StatsSummary
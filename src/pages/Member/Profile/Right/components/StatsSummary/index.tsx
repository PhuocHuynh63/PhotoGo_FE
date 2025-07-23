import { Card, CardContent, CardHeader, CardTitle } from '@components/Atoms/ui/card'
import { formatPrice } from '@utils/helpers/CurrencyFormat/CurrencyFormat'
import React from 'react'

const StatsSummary = () => {
    return (
        <>
            {/* Summary Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Thống kê tổng quan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{history.length}</div>
                            <div className="text-sm text-gray-500">Tổng giao dịch</div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {formatPrice(history.reduce((sum, sub) => sum + sub.price, 0))}
                            </div>
                            <div className="text-sm text-gray-500">Tổng chi phí</div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {history.filter((sub) => sub.status === "active").length}
                            </div>
                            <div className="text-sm text-gray-500">Đang hoạt động</div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {Math.round(history.reduce((sum, sub) => sum + sub.price, 0) / history.length)}
                            </div>
                            <div className="text-sm text-gray-500">Chi phí TB/tháng</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default StatsSummary
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface StatisticsChartsProps {
    data: {
        month: string,
        monthName: string,
        count: number
    }[]
}

export default function StatisticsCharts({ data }: StatisticsChartsProps) {

    return (

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Lịch hẹn theo tháng</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis dataKey="count" />
                            <Tooltip formatter={(value) => [`${value} lịch hẹn`, "Số lượng"]} />
                            <Bar dataKey="count" fill="#f97316" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

    )
}

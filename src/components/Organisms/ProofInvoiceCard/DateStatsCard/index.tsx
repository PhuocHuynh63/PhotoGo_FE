"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/Atoms/ui/card"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import CustomDatePicker from "@components/Atoms/DatePicker"
import React from "react"

interface DateStatsCardProps {
    selectedDate: Date | null;
    onDateChange: (date: Date | null) => void;
    needsProofCount: number;
    hasProofCount: number;
    formatDate: (dateStr: string) => string;
    selectedDateStr: string;
}

export default function DateStatsCard({ selectedDate, onDateChange, needsProofCount, hasProofCount, selectedDateStr }: DateStatsCardProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Ngày làm việc</CardTitle>
                </CardHeader>
                <CardContent>
                    <CustomDatePicker
                        value={selectedDate}
                        onChange={onDateChange}
                    // dayPickerProps={{
                    //     disabled: (date: Date) => date > new Date(),
                    // }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{(selectedDateStr)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cần bằng chứng</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{needsProofCount}</div>
                    <p className="text-xs text-muted-foreground">đơn cần upload</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đã có bằng chứng</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{hasProofCount}</div>
                    <p className="text-xs text-muted-foreground">Đơn đã hoàn thành</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tổng đơn</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{needsProofCount + hasProofCount}</div>
                    <p className="text-xs text-muted-foreground">đơn trong ngày</p>
                </CardContent>
            </Card>
        </div>
    )
} 
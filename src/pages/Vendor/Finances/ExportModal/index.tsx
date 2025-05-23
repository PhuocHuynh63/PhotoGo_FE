"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@components/Atoms/ui/dialog"
import { Button } from "@components/Atoms/ui/button"
import { Label } from "@components/Atoms/ui/label"
import { RadioGroup, RadioGroupItem } from "@components/Atoms/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/Atoms/ui/select"
import { Calendar } from "@components/Atoms/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@components/Atoms/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ExportModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
    const [fileType, setFileType] = useState("excel")
    const [dateRange, setDateRange] = useState("this-month")
    const [startDate, setStartDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())
    const [isStartDateOpen, setIsStartDateOpen] = useState(false)
    const [isEndDateOpen, setIsEndDateOpen] = useState(false)

    const handleExport = () => {
        // Trong thực tế, đây sẽ là API call để xuất file
        console.log("Exporting file:", {
            fileType,
            dateRange,
            startDate,
            endDate,
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Xuất báo cáo tài chính</DialogTitle>
                    <DialogDescription>Chọn định dạng file và khoảng thời gian để xuất báo cáo</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Định dạng file</Label>
                        <RadioGroup value={fileType} onValueChange={setFileType} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="excel" id="excel" />
                                <Label htmlFor="excel">Excel (.xlsx)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="csv" id="csv" />
                                <Label htmlFor="csv">CSV (.csv)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pdf" id="pdf" />
                                <Label htmlFor="pdf">PDF (.pdf)</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Khoảng thời gian</Label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn khoảng thời gian" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this-month">Tháng này</SelectItem>
                                <SelectItem value="last-month">Tháng trước</SelectItem>
                                <SelectItem value="this-quarter">Quý này</SelectItem>
                                <SelectItem value="last-quarter">Quý trước</SelectItem>
                                <SelectItem value="this-year">Năm nay</SelectItem>
                                <SelectItem value="custom">Tùy chỉnh</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {dateRange === "custom" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Từ ngày</Label>
                                <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                setStartDate(date)
                                                setIsStartDateOpen(false)
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>Đến ngày</Label>
                                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) => {
                                                setEndDate(date)
                                                setIsEndDateOpen(false)
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Nội dung xuất</Label>
                        <RadioGroup defaultValue="all" className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="all" />
                                <Label htmlFor="all">Tất cả giao dịch</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="income" id="income" />
                                <Label htmlFor="income">Chỉ giao dịch thu</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expense" id="expense" />
                                <Label htmlFor="expense">Chỉ giao dịch chi</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleExport} className="gap-2">
                        <Download className="h-4 w-4" />
                        Xuất file
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

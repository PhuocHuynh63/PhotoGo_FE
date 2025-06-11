import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/Atoms/ui/card'
import { Button } from '@components/Atoms/ui/button'
import { RefreshCw } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@components/Atoms/ui/accordion'
import { Badge } from '@components/Atoms/ui/badge'
import { Label } from '@components/Atoms/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/Atoms/ui/select'
import { Input } from '@components/Atoms/ui/input'
import { Trash2, Edit, Check, X } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@components/Atoms/ui/alert'


import React, { useState } from 'react'
import { cn } from '@utils/helpers/CN'
import locationAvailabilityService from '@services/locationAvailability'
import { toast } from 'react-hot-toast'
import { PAGES } from '../../../../../types/IPages'
import { ILocationScheduleResponse } from '@models/locationAvailability/response.model'
import { ISlotTime } from '@models/locationAvailability/common.model'



const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
}

const ManageWorkingDate = ({ workingHoursList, isLoadingData, fetchWorkingHours }: PAGES.IManageWorkingDateProps) => {

    const [selectedDateForSlots, setSelectedDateForSlots] = useState<{ [key: string]: string }>({})
    const [editingSlot, setEditingSlot] = useState<{ workingDateId: string, slotTimeId: string, selectedDate: string } | null>(null)
    const [editingMaxBookings, setEditingMaxBookings] = useState(1)
    const [isUpdatingSlot, setIsUpdatingSlot] = useState(false)

    const handleDeleteWorkingHours = async (workingHoursId: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent accordion from toggling

        if (!confirm("Bạn có chắc chắn muốn xóa lịch làm việc này?")) {
            return
        }

        try {
            const result = await locationAvailabilityService.deleteLocationAvailability(workingHoursId) as ILocationScheduleResponse
            console.log(result)
            if (result.statusCode === 200) {
                toast.success("Đã xóa lịch làm việc thành công")
                fetchWorkingHours() // Refresh data
            } else {
                toast.error("Đã xảy ra lỗi khi xóa lịch làm việc")
            }
        } catch (error) {
            console.error("Error deleting working hours:", error)
            toast.error("Đã xảy ra lỗi khi xóa lịch làm việc")
        }
    }

    // Handle editing slot
    const handleEditSlot = (workingDateId: string, slotTimeId: string, selectedDate: string, currentMaxBookings: number) => {
        console.log(workingDateId, slotTimeId, selectedDate, currentMaxBookings)
        setEditingSlot({ workingDateId, slotTimeId, selectedDate })
        setEditingMaxBookings(currentMaxBookings)
    }

    // Handle canceling edit
    const handleCancelEdit = () => {
        setEditingSlot(null)
        setEditingMaxBookings(1)
    }

    // Handle updating slot
    const handleUpdateSlot = async () => {
        if (!editingSlot) return

        setIsUpdatingSlot(true)
        try {
            // TODO: Implement update slot API call
            // const result = await locationAvailabilityService.updateSlotTime({
            //     workingDateId: editingSlot.workingDateId,
            //     slotTimeId: editingSlot.slotTimeId,
            //     isStrictTimeBlocking: true,
            //     maxParallelBookings: editingMaxBookings
            // })

            toast.success("Đã cập nhật slot thành công")
            setEditingSlot(null)
            fetchWorkingHours() // Refresh data
        } catch (error) {
            console.error("Error updating slot:", error)
            toast.error("Đã xảy ra lỗi khi cập nhật slot")
        } finally {
            setIsUpdatingSlot(false)
        }
    }

    return (
        <>
            <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Lịch làm việc đã tạo</CardTitle>
                        <CardDescription>Quản lý các lịch làm việc và khung giờ</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchWorkingHours} disabled={isLoadingData} className='cursor-pointer'>
                        <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingData && "animate-spin")} />
                        Làm mới
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoadingData ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : workingHoursList?.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {workingHoursList?.map((workingHours) => (
                                <AccordionItem key={workingHours.id} value={workingHours.id}>
                                    <div className="relative">
                                        <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md cursor-pointer pr-16">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex flex-col items-start text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {formatTime(workingHours.startTime)} - {formatTime(workingHours.endTime)}
                                                        </span>
                                                        <Badge variant={workingHours.isAvailable ? "default" : "outline"}>
                                                            {workingHours.isAvailable ? "Hoạt động" : "Không hoạt động"}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {workingHours?.workingDates?.length} ngày từ {workingHours?.workingDates[0]} đến{" "}
                                                        {workingHours?.workingDates[workingHours?.workingDates?.length - 1]}
                                                    </span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => handleDeleteWorkingHours(workingHours.id, e)}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <AccordionContent className="px-4">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                {workingHours.workingDates
                                                    ?.sort((a: string, b: string) => {
                                                        // Convert date strings to Date objects for proper sorting
                                                        const dateA = new Date(a.split('/').reverse().join('-'))
                                                        const dateB = new Date(b.split('/').reverse().join('-'))
                                                        return dateA.getTime() - dateB.getTime()
                                                    })
                                                    ?.map((date: string) => (
                                                        <Badge
                                                            key={date}
                                                            variant={selectedDateForSlots[workingHours.id] === date ? "default" : "outline"}
                                                            className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                                            onClick={() => setSelectedDateForSlots(prev => ({ ...prev, [workingHours.id]: date }))}
                                                        >
                                                            {date}
                                                        </Badge>
                                                    ))}
                                            </div>

                                            <div className="border rounded-md p-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-medium">Khung giờ làm việc</h4>
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-sm">Chọn ngày:</Label>
                                                        <Select
                                                            value={selectedDateForSlots[workingHours.id] || ""}
                                                            onValueChange={(value) => setSelectedDateForSlots(prev => ({ ...prev, [workingHours.id]: value }))}
                                                        >
                                                            <SelectTrigger className="w-32">
                                                                <SelectValue placeholder="Chọn ngày" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {workingHours.workingDates
                                                                    ?.sort((a: string, b: string) => {
                                                                        const dateA = new Date(a.split('/').reverse().join('-'))
                                                                        const dateB = new Date(b.split('/').reverse().join('-'))
                                                                        return dateA.getTime() - dateB.getTime()
                                                                    })
                                                                    ?.map((date: string) => (
                                                                        <SelectItem key={date} value={date}>
                                                                            {date}
                                                                        </SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {workingHours.slotTimes?.length > 0 && selectedDateForSlots[workingHours.id] ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {workingHours.slotTimes?.map((slot: ISlotTime) => {
                                                            const isEditing = editingSlot?.workingDateId === workingHours.id && editingSlot?.slotTimeId === slot.id

                                                            return (
                                                                <div key={slot.slot} className="border rounded-md p-3 flex flex-col space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-medium">Slot {slot.slot}</span>
                                                                        {!isEditing ? (
                                                                            <div className="flex items-center gap-2">
                                                                                <Badge variant="outline" className="text-xs">
                                                                                    {slot.maxParallelBookings} lịch
                                                                                </Badge>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => handleEditSlot(workingHours.id, slot.id, selectedDateForSlots[workingHours.id], slot.maxParallelBookings)}
                                                                                    className="h-6 w-6 p-0 text-gray-500 hover:text-blue-600"
                                                                                >
                                                                                    <Edit className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center gap-1">
                                                                                <Input
                                                                                    type="number"
                                                                                    min="1"
                                                                                    max="10"
                                                                                    value={editingMaxBookings}
                                                                                    onChange={(e) => setEditingMaxBookings(parseInt(e.target.value) || 1)}
                                                                                    className="w-16 h-6 text-xs"
                                                                                />
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={handleUpdateSlot}
                                                                                    disabled={isUpdatingSlot}
                                                                                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                                                                >
                                                                                    {isUpdatingSlot ? (
                                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                                    ) : (
                                                                                        <Check className="h-3 w-3" />
                                                                                    )}
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={handleCancelEdit}
                                                                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                                                                >
                                                                                    <X className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-sm text-gray-600">
                                                                        {formatTime(slot.startSlotTime)} - {formatTime(slot.endSlotTime)}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : workingHours.slotTimes?.length > 0 ? (
                                                    <div className="text-center py-4 text-gray-500">
                                                        <p>Vui lòng chọn ngày để xem và chỉnh sửa khung giờ</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <Alert>
                                                            <AlertTitle>Chưa có khung giờ</AlertTitle>
                                                            <AlertDescription>
                                                                Lịch làm việc này chưa có khung giờ. Bấm nút bên dưới để tạo các khung giờ tự động.
                                                            </AlertDescription>
                                                        </Alert>
                                                        {/* <Button
                                                                    onClick={() => handleCreateTimeSlots(workingHours.id)}
                                                                    disabled={isLoadingSlots}
                                                                    className="w-full"
                                                                >
                                                                    {isLoadingSlots ? (
                                                                        <>
                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                            Đang tạo...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Plus className="mr-2 h-4 w-4" />
                                                                            Tạo khung giờ tự động
                                                                        </>
                                                                    )}
                                                                </Button> */}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-8 border rounded-md">
                            <p className="text-gray-500">Chưa có lịch làm việc nào được tạo</p>
                            <p className="text-sm text-gray-400 mt-1">Sử dụng form bên trái để tạo lịch làm việc mới</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default ManageWorkingDate
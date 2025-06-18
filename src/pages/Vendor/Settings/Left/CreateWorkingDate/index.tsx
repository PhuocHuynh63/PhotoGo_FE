import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/Atoms/ui/card'
import { Label } from '@components/Atoms/ui/label'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@components/Atoms/ui/select'
import { Button } from '@components/Atoms/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@components/Atoms/ui/dialog'

import { Input } from '@components/Atoms/ui/input'
import { Switch } from '@components/Atoms/ui/switch'
import { Loader2 } from 'lucide-react'
import { Plus } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'


import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import locationAvailabilityService from '@services/locationAvailability'
import { validateWorkingDateForm } from '@utils/helpers/Validation'

import CustomDatePicker from '@components/Atoms/DatePicker'

interface Location {
    id: string
    address: string
    district: string
    ward: string
    city: string
}

const CreateWorkingDate = ({ locations, selectedLocation, setSelectedLocation, fetchWorkingHours }: { locations: Location[], selectedLocation: string, setSelectedLocation: (value: string) => void, fetchWorkingHours: () => void }) => {

    const [startDate, setStartDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())
    const [startTime, setStartTime] = useState("08:00")
    const [endTime, setEndTime] = useState("19:00")
    const [isAvailable, setIsAvailable] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form data using helper function
        const validation = validateWorkingDateForm({
            startDate,
            endDate,
            startTime,
            endTime,
            selectedLocation
        })

        if (!validation.isValid) {
            toast.error(validation.message)
            return
        }

        setShowConfirmModal(true)
    }

    const handleConfirmSubmit = async () => {
        if (!startDate || !endDate) return

        // Validate time range
        const startTimeMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1])
        const endTimeMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1])
        if (startTimeMinutes >= endTimeMinutes) {
            toast.error('Giờ kết thúc phải sau giờ bắt đầu')
            return
        }

        setShowConfirmModal(false)
        setIsLoading(true)
        try {
            const formattedStartDate = format(startDate, "dd/MM/yyyy")
            const formattedEndDate = format(endDate, "dd/MM/yyyy")
            const numberOfDays = differenceInDays(endDate, startDate)

            await locationAvailabilityService.createLocationAvailability(
                {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    startTime,
                    endTime,
                    isAvailable,
                }, selectedLocation)
            toast.success(`Đã tạo lịch làm việc cho ${numberOfDays} ngày liên tục`)
            fetchWorkingHours() // Refresh data
        } catch (error: unknown) {
            console.error("Error creating working hours:", error)
            const errorMessage = error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' && 'data' in error.response &&
                error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data ?
                String(error.response.data.message) : "Đã xảy ra lỗi khi tạo lịch làm việc"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const getSelectedLocationName = () => {
        const location = locations?.find(loc => loc.id === selectedLocation)
        return location ? `${location.address}, ${location.district} - ${location.ward}` : 'Không xác định'
    }

    const numberOfDays = endDate && startDate ? differenceInDays(endDate, startDate) : 0

    return (
        <>
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Tạo lịch làm việc mới</CardTitle>
                    <CardDescription>Tạo lịch làm việc cho {numberOfDays} ngày liên tục từ ngày được chọn</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Địa điểm</Label>
                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn địa điểm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations?.map((location) => (
                                        <SelectItem key={location.id} value={location.id}>
                                            {location.address}, {location.district} - {location.ward}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Ngày bắt đầu</Label>
                            <CustomDatePicker
                                placeholder="Chọn ngày bắt đầu"
                                value={startDate || null}
                                onChange={(selectedDate) => {
                                    if (selectedDate) {
                                        setStartDate(selectedDate)
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Ngày kết thúc</Label>
                            <CustomDatePicker
                                placeholder="Chọn ngày kết thúc"
                                value={endDate || null}
                                onChange={(selectedDate) => {
                                    if (selectedDate) {
                                        setEndDate(selectedDate)
                                    }
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Giờ bắt đầu</Label>
                                <div className="flex items-center">
                                    {/* <Clock className="mr-2 h-4 w-4 text-gray-500" /> */}
                                    <Input className='cursor-pointer'
                                        id="startTime"
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">Giờ kết thúc</Label>
                                <div className="flex items-center">
                                    {/* <Clock className="mr-2 h-4 w-4 text-gray-500" /> */}
                                    <Input className='cursor-pointer' id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="isAvailable" checked={isAvailable} onCheckedChange={setIsAvailable} />
                            <Label htmlFor="isAvailable">Có thể đặt lịch</Label>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} disabled={isLoading} className="w-full cursor-pointer">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo lịch làm việc
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Modal Confirm */}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xác nhận tạo lịch làm việc</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn tạo lịch làm việc với thông tin sau?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Địa điểm:</p>
                            <p className="text-sm text-gray-600">{getSelectedLocationName()}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Ngày bắt đầu:</p>
                            <p className="text-sm text-gray-600">{startDate ? format(startDate, "dd/MM/yyyy") : ""}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Ngày kết thúc:</p>
                            <p className="text-sm text-gray-600">{endDate ? format(endDate, "dd/MM/yyyy") : ""}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Thời gian:</p>
                            <p className="text-sm text-gray-600">{startTime} - {endTime}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Trạng thái:</p>
                            <p className="text-sm text-gray-600">{isAvailable ? "Có thể đặt lịch" : "Không thể đặt lịch"}</p>
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-700">
                                ⚠️ Lịch làm việc sẽ được tạo cho {numberOfDays} ngày liên tục từ ngày được chọn.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className='cursor-pointer' variant="outline" onClick={() => setShowConfirmModal(false)}>
                            Hủy
                        </Button>
                        <Button className='cursor-pointer' onClick={handleConfirmSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang tạo...
                                </>
                            ) : (
                                "Xác nhận"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateWorkingDate
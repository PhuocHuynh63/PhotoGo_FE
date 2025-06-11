import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/Atoms/ui/card'
import { Label } from '@components/Atoms/ui/label'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@components/Atoms/ui/select'
import { Button } from '@components/Atoms/ui/button'

import { Input } from '@components/Atoms/ui/input'
import { Switch } from '@components/Atoms/ui/switch'
import { Loader2 } from 'lucide-react'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'


import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import locationAvailabilityService from '@services/locationAvailability'

import CustomDatePicker from '@components/Atoms/DatePicker'

interface Location {
    id: string
    address: string
    district: string
    ward: string
    city: string
}

const CreateWorkingDate = ({ locations, selectedLocation, setSelectedLocation, fetchWorkingHours }: { locations: Location[], selectedLocation: string, setSelectedLocation: (value: string) => void, fetchWorkingHours: () => void }) => {

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [startTime, setStartTime] = useState("08:00")
    const [endTime, setEndTime] = useState("19:00")
    const [isAvailable, setIsAvailable] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!date) {
            toast.error("Vui lòng chọn ngày bắt đầu")
            return
        }

        setIsLoading(true)
        try {
            const formattedDate = format(date, "dd/MM/yyyy")
            const result = await locationAvailabilityService.createLocationAvailability(
                {
                    date: formattedDate,
                    startTime,
                    endTime,
                    isAvailable,
                }, selectedLocation)
            console.log(result)
            toast.success("Đã tạo lịch làm việc cho 7 ngày liên tục")
            fetchWorkingHours() // Refresh data
        } catch (error) {
            console.error("Error creating working hours:", error)
            toast.error("Đã xảy ra lỗi khi tạo lịch làm việc")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Tạo lịch làm việc mới</CardTitle>
                    <CardDescription>Tạo lịch làm việc cho 7 ngày liên tục từ ngày được chọn</CardDescription>
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
                                    {locations.map((location) => (
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
                                value={date || null}
                                onChange={(selectedDate) => {
                                    if (selectedDate) {
                                        setDate(selectedDate)
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
        </>
    )
}

export default CreateWorkingDate
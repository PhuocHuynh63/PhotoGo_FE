"use client"

import { Card, CardContent } from "@components/Atoms/ui/card"
import { Badge } from "@components/Atoms/ui/badge"

interface Announcement {
    id: string
    title: string
    content: string
    type: string
    date: string
}

interface AnnouncementsProps {
    announcements: Announcement[]
}

export default function Announcements({ announcements }: AnnouncementsProps) {
    // Hàm để hiển thị ngày
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    }

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-medium">Thông báo</h3>
                <p className="text-sm text-gray-500">Cập nhật mới nhất từ hệ thống</p>
            </div>

            <div className="space-y-4">
                {announcements?.map((announcement) => (
                    <Card key={announcement.id} className="bg-white">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium pr-4">{announcement.title}</h4>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {announcement.type && (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{announcement.type}</Badge>
                                    )}
                                    <span className="text-sm text-gray-500">{formatDate(announcement.date)}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{announcement.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

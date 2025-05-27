"use client"

import { Card, CardContent } from "@components/Atoms/ui/card"
import { Button } from "@components/Atoms/ui/button"
import { Badge } from "@components/Atoms/ui/badge"
import { FileText, ExternalLink } from "lucide-react"

interface Guide {
    id: string
    title: string
    description: string
    category: string
    fileUrl: string
}

interface UserGuidesProps {
    guides: Guide[]
}

export default function UserGuides({ guides }: UserGuidesProps) {
    // Hàm để hiển thị màu badge theo category
    const getCategoryBadge = (category: string) => {
        switch (category) {
            case "Tài khoản":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Tài khoản</Badge>
            case "Lịch hẹn":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lịch hẹn</Badge>
            case "Tài chính":
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Tài chính</Badge>
            case "Marketing":
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Marketing</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{category}</Badge>
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-medium">Hướng dẫn sử dụng</h3>
                <p className="text-sm text-gray-500">Tìm hiểu cách sử dụng nền tảng hiệu quả nhất</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides?.map((guide) => (
                    <Card key={guide.id} className="bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-4 mx-auto">
                                <FileText className="h-8 w-8 text-gray-500" />
                            </div>

                            <div className="text-center mb-4">{getCategoryBadge(guide.category)}</div>

                            <h4 className="font-medium text-center mb-2">{guide.title}</h4>
                            <p className="text-sm text-gray-500 text-center mb-4">{guide.description}</p>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 gap-1">
                                    <FileText className="h-4 w-4" />
                                    Tải PDF
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 gap-1">
                                    <ExternalLink className="h-4 w-4" />
                                    Xem hướng dẫn
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

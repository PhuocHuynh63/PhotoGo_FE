'use client'

import { Badge } from "@components/Atoms/ui/badge"
import { Button } from "@components/Atoms/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@components/Atoms/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { StarIcon } from "lucide-react"
import Image from "next/image"


export default function ReviewsPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Đánh giá dịch vụ</h1>
                <p className="text-muted-foreground">Xem và quản lý đánh giá cho các dịch vụ bạn đã sử dụng</p>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="pending">Chưa đánh giá</TabsTrigger>
                    <TabsTrigger value="completed">Đã đánh giá</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <div className="grid gap-6">
                        <ReviewCard
                            serviceName="Wedding Photoshoot Premium"
                            studioName="Elegant Studio"
                            date="15/05/2024"
                            orderId="B001"
                            price="5.500.000 đ"
                            rating={5}
                            reviewText="Dịch vụ chụp ảnh cưới tuyệt vời! Nhiếp ảnh gia rất chuyên nghiệp và ảnh đẹp hơn mong đợi. Chúng tôi rất hài lòng với kết quả và sẽ giới thiệu cho bạn bè."
                            reviewDate="20/05/2024"
                            imageUrl="/placeholder.svg?height=400&width=600"
                        />

                        <ReviewCard
                            serviceName="Family Portrait Session"
                            studioName="Vintage Lens"
                            date="28/04/2024"
                            orderId="B002"
                            price="2.800.000 đ"
                            rating={4}
                            reviewText="Buổi chụp ảnh gia đình rất vui và thoải mái. Nhiếp ảnh gia biết cách làm cho bọn trẻ hợp tác. Ảnh đẹp nhưng thời gian chỉnh sửa hơi lâu."
                            reviewDate="05/05/2024"
                            imageUrl="/placeholder.svg?height=400&width=600"
                        />

                        <ReviewCard
                            serviceName="Product Photography"
                            studioName="Clear Shot Studio"
                            date="10/04/2024"
                            orderId="B003"
                            price="1.200.000 đ"
                            isPending={true}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="pending">
                    <div className="grid gap-6">
                        <ReviewCard
                            serviceName="Product Photography"
                            studioName="Clear Shot Studio"
                            date="10/04/2024"
                            orderId="B003"
                            price="1.200.000 đ"
                            isPending={true}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="completed">
                    <div className="grid gap-6">
                        <ReviewCard
                            serviceName="Wedding Photoshoot Premium"
                            studioName="Elegant Studio"
                            date="15/05/2024"
                            orderId="B001"
                            price="5.500.000 đ"
                            rating={5}
                            reviewText="Dịch vụ chụp ảnh cưới tuyệt vời! Nhiếp ảnh gia rất chuyên nghiệp và ảnh đẹp hơn mong đợi. Chúng tôi rất hài lòng với kết quả và sẽ giới thiệu cho bạn bè."
                            reviewDate="20/05/2024"
                            imageUrl="/placeholder.svg?height=400&width=600"
                        />

                        <ReviewCard
                            serviceName="Family Portrait Session"
                            studioName="Vintage Lens"
                            date="28/04/2024"
                            orderId="B002"
                            price="2.800.000 đ"
                            rating={4}
                            reviewText="Buổi chụp ảnh gia đình rất vui và thoải mái. Nhiếp ảnh gia biết cách làm cho bọn trẻ hợp tác. Ảnh đẹp nhưng thời gian chỉnh sửa hơi lâu."
                            reviewDate="05/05/2024"
                            imageUrl="/placeholder.svg?height=400&width=600"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

interface ReviewCardProps {
    serviceName: string
    studioName: string
    date: string
    orderId: string
    price: string
    rating?: number
    reviewText?: string
    reviewDate?: string
    imageUrl?: string
    isPending?: boolean
}

function ReviewCard({
    serviceName,
    studioName,
    date,
    orderId,
    price,
    rating,
    reviewText,
    reviewDate,
    imageUrl,
    isPending = false,
}: ReviewCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{serviceName}</h3>
                        {isPending ? (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Chưa đánh giá
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Đã đánh giá
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">{studioName}</p>
                </div>
                <div className="text-right">
                    <p className="font-medium">{price}</p>
                    <p className="text-sm text-muted-foreground">Mã đơn: {orderId}</p>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="flex flex-col md:flex-row gap-6">
                    {imageUrl && (
                        <div className="md:w-1/3">
                            <Image
                                src={imageUrl || "/placeholder.svg"}
                                alt={serviceName}
                                width={300}
                                height={200}
                                className="rounded-md object-cover w-full h-48"
                            />
                        </div>
                    )}
                    <div className={imageUrl ? "md:w-2/3" : "w-full"}>
                        <div className="flex items-center gap-1 mb-2">
                            <p className="text-sm text-muted-foreground">Ngày sử dụng dịch vụ: {date}</p>
                        </div>

                        {isPending ? (
                            <div className="bg-muted p-4 rounded-md">
                                <p className="mb-2 font-medium">Bạn chưa đánh giá dịch vụ này</p>
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon key={star} className="w-6 h-6 stroke-muted-foreground fill-none" />
                                    ))}
                                </div>
                                <Button>Viết đánh giá</Button>
                            </div>
                        ) : (
                            <div className="bg-muted/30 p-4 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                className={`w-5 h-5 ${i < (rating || 0) ? "fill-primary stroke-primary" : "fill-none stroke-muted-foreground"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Đánh giá ngày: {reviewDate}</p>
                                </div>
                                <p className="text-sm">{reviewText}</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm">
                    Xem chi tiết đơn
                </Button>
                {isPending ? (
                    <Button size="sm">Đánh giá ngay</Button>
                ) : (
                    <Button variant="outline" size="sm">
                        Chỉnh sửa đánh giá
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

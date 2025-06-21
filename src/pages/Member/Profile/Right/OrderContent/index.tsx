"use client"

import { Calendar } from "lucide-react";
import Input from "@components/Atoms/Input";
import { Tabs, TabsList, TabsTrigger } from "@components/Molecules/Tabs";
import { useState } from "react";
import { IPagination } from "@models/metadata";
import Pagination from "@components/Organisms/Pagination/Pagination";
import { useRouter } from "next/navigation";
import { IInvoice } from "@models/invoice/common.model";
import { useBooking } from "@utils/hooks/useBooking";
import { IBooking } from "@models/booking/common.model";
import { Skeleton } from "@components/Atoms/ui/skeleton";
import BookingCardSkeleton from "../Components/OrderSkeleton";
import BookingCard from "../Components/OrderBookingCard";


interface OrdersContentProps {
    invoices: IInvoice[];
    pagination: IPagination;
}

const OrdersContent = ({ invoices, pagination }: OrdersContentProps) => {
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter();
    const { bookings, loading } = useBooking(invoices);
    const handlePageChange = (page: number) => {
        router.push(`?page=${page}`);
    };

    // Filter bookings based on active tab and search query
    const filteredBookings = bookings.filter((booking) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "upcoming" && booking.status === "chờ xử lý") ||
            (activeTab === "pending" && booking.status === "chờ thanh toán") ||
            (activeTab === "completed" && booking.status === "đã hoàn thành") ||
            (activeTab === "cancelled" && booking.status === "đã hủy")

        const matchesSearch =
            booking?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking?.email?.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesTab && matchesSearch
    })

    if (loading) {
        return (
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <Skeleton className="h-8 w-64 bg-gray-200" />
                    <Skeleton className="h-10 w-[300px] bg-gray-200" />
                </div>

                <Skeleton className="h-12 w-full max-w-xl mx-auto mb-6 bg-gray-200" />

                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map((i) => (
                        <BookingCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Quản lý đơn hàng chụp ảnh</h1>
                <Input
                    icon="Search"
                    placeholder="Tìm kiếm đơn hàng theo tên, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[300px]"
                />
            </div>

            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 gap-2 bg-orange-100 p-1 rounded-xl max-w-xl mx-auto mb-6">
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="upcoming">Chờ xử lý</TabsTrigger>
                    <TabsTrigger value="pending">Chờ thanh toán</TabsTrigger>
                    <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
                    <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
                </TabsList>
            </Tabs>

            {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Không tìm thấy đơn hàng nào</h3>
                    <p className="text-muted-foreground">
                        {searchQuery ? `Không có kết quả cho "${searchQuery}"` : "Bạn chưa có đơn hàng nào trong danh mục này"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking as unknown as IBooking & { invoice: IInvoice }} />
                        ))}
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Pagination
                            total={pagination.totalPage}
                            current={pagination.current}
                            onChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </div>
    )
}


export default OrdersContent

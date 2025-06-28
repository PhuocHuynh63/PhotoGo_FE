"use client"

import { Calendar } from "lucide-react";
import Input from "@components/Atoms/Input";
import { Tabs, TabsList, TabsTrigger } from "@components/Molecules/Tabs";
import { useState } from "react";
import { IPagination } from "@models/metadata";
import Pagination from "@components/Organisms/Pagination/Pagination";
import { useRouter } from "next/navigation";
import { IInvoice } from "@models/invoice/common.model";
import { IBooking } from "@models/booking/common.model";
import BookingCard from "./Components/OrderBookingCard";


interface OrdersContentProps {
    invoices: IInvoice[];
    pagination: IPagination;
    newBooking: IBooking;
}

const OrdersContent = ({ invoices, pagination, newBooking }: OrdersContentProps) => {
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter();
    const handlePageChange = (page: number) => {
        router.push(`?page=${page}`);
    };
    // Filter bookings based on active tab and search query
    let filteredBookings = invoices?.map((invoice) => invoice.booking).filter((booking) => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "upcoming" && booking.status === "chờ xử lý") ||
            (activeTab === "pending" && booking.status === "chờ thanh toán") ||
            (activeTab === "completed" && booking.status === "đã hoàn thành") ||
            (activeTab === "cancelled" && booking.status === "đã hủy")
        return matchesTab
    })
    // Đưa booking mới lên đầu nếu có trong danh sách
    if (newBooking && filteredBookings?.some(b => b.id === newBooking.id)) {
        const newBookingItem = filteredBookings?.find(b => b.id === newBooking.id)
        if (newBookingItem) {
            filteredBookings = [
                newBookingItem,
                ...filteredBookings?.filter(b => b.id !== newBooking.id)
            ]
        }
    }
    console.log(invoices)
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

            {filteredBookings?.length === 0 ? (
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
                        {filteredBookings?.map((booking) => {
                            const invoice = invoices?.find((invoice) => invoice.booking.id === booking.id) as IInvoice;
                            const isNew = !!(newBooking && booking.id === newBooking.id);
                            if (!booking) return null;
                            return (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking as unknown as IBooking}
                                    invoice={invoice}
                                    isNew={isNew}
                                />
                            );
                        })}
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Pagination
                            total={pagination?.totalPage}
                            current={pagination?.current}
                            onChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </div>
    )
}


export default OrdersContent

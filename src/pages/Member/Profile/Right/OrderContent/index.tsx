"use client"

import { Tabs, TabsList, TabsTrigger } from "@components/Molecules/Tabs";
import { useEffect, useState } from "react";
import { IPagination } from "@models/metadata";
import Pagination from "@components/Organisms/Pagination/Pagination";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import { IInvoiceModel } from "@models/invoice/common.model";
import { IBooking } from "@models/booking/common.model";
import BookingCard from "./Components/OrderBookingCard";
import { BOOKING } from "@constants/booking";
import Input from "@components/Atoms/Input";
import { useDebounce } from "@utils/hooks/useDebounce";


interface OrdersContentProps {
    invoices: IInvoiceModel[];
    pagination: IPagination;
    newBooking: IBooking;
}

const OrdersContent = ({ invoices, pagination, newBooking }: OrdersContentProps) => {
    /**
     * Router and search parameters
     * This will be used to handle pagination and navigation within the orders page
     */
    const router = useRouter();
    const searchParams = useSearchParams() as ReadonlyURLSearchParams;
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const [activeTab, setActiveTab] = useState(searchParams.get('status') || '');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('term') || '');

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.set('status', activeTab);
        params.set('term', debouncedSearchQuery);

        params.set('page', '1');

        router.push(`?${params.toString()}`);

    }, [activeTab, debouncedSearchQuery]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };
    //-------------------------------End--------------------------------//


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

            <Tabs defaultValue="" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols- gap-2 bg-orange-100 p-1 rounded-xl max-w-2xl mx-auto mb-6">
                    <TabsTrigger value="">Tất cả</TabsTrigger>
                    <TabsTrigger value={BOOKING.BOOKING_STATUS.PENDING}>Chờ xác nhận</TabsTrigger>
                    <TabsTrigger value={BOOKING.BOOKING_STATUS.CONFIRMED}>Đã xác nhận</TabsTrigger>
                    <TabsTrigger value={BOOKING.BOOKING_STATUS.IN_PROGRESS}>Đang thực hiện</TabsTrigger>
                    <TabsTrigger value={BOOKING.BOOKING_STATUS.COMPLETED}>Đã hoàn thành</TabsTrigger>
                    {/* <TabsTrigger value={BOOKING.BOOKING_STATUS.}>Đã hủy</TabsTrigger> */}
                </TabsList>
            </Tabs>

            {/* {invoices?.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Không tìm thấy đơn hàng nào</h3>
                    <p className="text-muted-foreground">
                        {searchQuery ? `Không có kết quả cho "${searchQuery}"` : "Bạn chưa có đơn hàng nào trong danh mục này"}
                    </p>
                </div>
            ) : ( */}
            <>
                <div className="grid grid-cols-1 gap-6">
                    {invoices?.map((invoice) => {
                        const isNew = newBooking?.id === invoice?.booking?.id;

                        return (
                            <BookingCard
                                key={invoice.id}
                                booking={invoice?.booking as unknown as IBooking}
                                invoice={invoice}
                                isNew={isNew}
                            />
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-center">
                    <Pagination
                        total={pagination?.totalPage}
                        current={currentPage}
                        onChange={handlePageChange}
                    />
                </div>
            </>
            {/* )} */}
        </div>
    )
}


export default OrdersContent

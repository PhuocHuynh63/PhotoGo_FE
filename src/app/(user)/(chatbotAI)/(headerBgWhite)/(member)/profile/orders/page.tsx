import { authOptions } from "@lib/authOptions";
import { IBooking } from "@models/booking/common.model";
import { IBookingResponseModel } from "@models/booking/repsonse.model";
import { IInvoiceListResponse } from "@models/invoice/response.model";
import { IPagination } from "@models/metadata";
import OrdersPage from "@pages/Member/Profile/Right/OrderContent"
import BookingService from "@services/booking";
import InvoiceService from "@services/invoice"
import { METADATA } from "../../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import { IInvoiceModel } from "@models/invoice/common.model";


async function getInvoices(userId: string, page: number = 1, pageSize: number = 10, status?: string, term?: string) {
    return await InvoiceService.getInvoiceByUserId(userId, page, pageSize, status, term) as IInvoiceListResponse
}

async function getBookingByPaymentOSId(paymentOSId: string) {
    return await BookingService.getBookingByPaymentOSId(paymentOSId)
}

interface OrdersProps {
    searchParams: Promise<{
        id?: string;
        page?: string;
        status?: string;
        term?: string;
    }>
}

export default async function Orders({ searchParams }: OrdersProps) {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const { page, status, term, id } = await searchParams;
    
    const currentPage = Number(page) || 1;
    const invoices = await getInvoices(session.user.id, currentPage, 10, status, term) as IInvoiceListResponse;

    if (!invoices || !invoices.data) {
        return <div>No invoices found.</div>;
    }
    const invoicesData = invoices?.data?.data as IInvoiceModel[] || []
    const paginationInvoices = invoices?.data?.pagination as IPagination || null

    let booking = null;
    if (id) {
        booking = await getBookingByPaymentOSId(id) as IBookingResponseModel
    }
    const bookingData = booking?.data as unknown as IBooking || null

    return (
        <>
            <OrdersPage invoices={invoicesData} pagination={paginationInvoices} newBooking={bookingData} />
        </>
    )
}
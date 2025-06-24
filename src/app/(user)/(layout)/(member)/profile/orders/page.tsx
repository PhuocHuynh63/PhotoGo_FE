import { authOptions } from "@lib/authOptions";
import { IBooking } from "@models/booking/common.model";
import { IBookingResponseModel } from "@models/booking/repsonse.model";
import { IInvoice } from "@models/invoice/common.model";
import { IInvoiceListResponse } from "@models/invoice/response.model";
import { IPagination } from "@models/metadata";
import OrdersPage from "@pages/Member/Profile/Right/OrderContent"
import BookingService from "@services/booking";
import InvoiceService from "@services/invoice"
import { getServerSession } from "next-auth";


async function getInvoices(userId: string) {
    const invoices = await InvoiceService.getInvoiceByUserId(userId)
    return invoices
}

async function getBookingByPaymentOSId(paymentOSId: string) {
    const booking = await BookingService.getBookingByPaymentOSId(paymentOSId)
    return booking
}

interface OrdersProps {
    searchParams: Promise<{ id: string }>
}

export default async function Orders({ searchParams }: OrdersProps) {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const invoices = await getInvoices(session.user.id) as IInvoiceListResponse
    const invoicesData = invoices.data?.data as IInvoice[]
    const paginationInvoices = invoices.data?.pagination as IPagination

    const { id } = await searchParams || {};
    let booking = null;
    if (id) {
        booking = await getBookingByPaymentOSId(id) as IBookingResponseModel
    }
    const bookingData = booking?.data as unknown as IBooking
    return (
        <>
            <OrdersPage invoices={invoicesData} pagination={paginationInvoices} newBooking={bookingData} />
        </>
    )
}
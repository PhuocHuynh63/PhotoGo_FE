import { authOptions } from "@lib/authOptions";
import { IInvoice } from "@models/invoice/common.model";
import { IInvoiceListResponse } from "@models/invoice/response.model";
import { IPagination } from "@models/metadata";
import OrdersPage from "@pages/Member/Profile/Right/OrderContent"
import InvoiceService from "@services/invoice"
import { getServerSession } from "next-auth";


async function getInvoices(userId: string) {
    const invoices = await InvoiceService.getInvoiceByUserId(userId)
    return invoices
}

export default async function Orders() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const invoices = await getInvoices(session.user.id) as IInvoiceListResponse
    const invoicesData = invoices.data?.data as IInvoice[]
    const paginationInvoices = invoices.data?.pagination as IPagination
    return (
        <>
            <OrdersPage invoices={invoicesData} pagination={paginationInvoices} />
        </>
    )
}
import { authOptions } from "@lib/authOptions";
import ProofManagementPage from "@pages/Vendor/Proof";
import invoiceService from "@services/invoice";
import { METADATA } from "../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import { IInvoice } from "@models/invoice/common.model";
import { IInvoiceListResponse } from "@models/invoice/response.model";
import vendorService from "@services/vendors";
import { IVendorResponse } from "@models/vendor/response.model";

async function getInvoices(userId: string) {
    const invoices = await invoiceService.getInvoiceByUserId(userId)
    return invoices
}

async function getLocationsByUserId(userId: string) {
    const locations = await vendorService.getVendorByUserId(userId)
    return locations
}

interface Booking {
    id: string
    userId: string
    locationId: string
    serviceConceptId: string
    date: string
    time?: string
    status?: string
    sourceType?: string
    sourceId?: string | null
    depositAmount?: string | number
    depositType?: string
    userNote?: string
    fullName?: string
    phone?: string
    email?: string
    code?: string
    priorityScore?: string
    created_at?: string
    updated_at?: string
}

interface Payment {
    id: string
    invoiceId: string
    amount: string
    paymentOSId: string
    paymentMethod: string
    status: string
    type: string
    transactionId: string
    description: string
    createdAt: string
    updatedAt: string
}

interface Invoice {
    id: string
    bookingId: string
    voucherId?: string | null
    originalPrice: number
    discountAmount: number
    discountedPrice: number
    taxAmount: number
    feeAmount: number
    payablePrice: number
    depositAmount: number
    remainingAmount: number
    paidAmount: number
    status: string
    issuedAt: string
    updatedAt: string
    booking: Booking
    payments: Payment[]
    vendorId: string
    // Proof fields
    proofImages?: string[]
    proofNotes?: string
    proofUploadedAt?: string
    needsProof?: boolean
}

export default async function ProofManagement() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const invoices = await getInvoices(session.user.id) as IInvoiceListResponse
    const invoicesData = invoices?.data?.data as IInvoice[] || []
    const vendor = await getLocationsByUserId(session.user.id) as IVendorResponse
    const locations = vendor.data?.locations || []
    return (
        <>
            <ProofManagementPage invoices={invoicesData as unknown as Invoice[]} locations={locations} />
        </>
    )
}


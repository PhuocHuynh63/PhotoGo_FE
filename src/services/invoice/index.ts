import http from "@configs/fetch"

const invoiceService = {
    getInvoiceByUserId: async (userId: string, current: number = 1, pageSize: number = 10, sortBy: string = "issuedAt", sortDirection: string = "desc") => {
        return await http.get(`/invoices/user/${userId}?current=${current}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`, {
            next: { tags: [`invoice-${userId}`] }
        });
    }
}

export default invoiceService

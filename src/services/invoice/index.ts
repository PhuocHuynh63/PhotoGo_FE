import http from "@configs/fetch"

const invoiceService = {
    getInvoiceByUserId: async (
        userId: string,
        current: number = 1,
        pageSize: number = 10,
        status?: string | null,
        term?: string | null,
        sortBy: string = "issuedAt",
        sortDirection: string = "desc"
    ) => {
        const params = new URLSearchParams({
            current: String(current),
            pageSize: String(pageSize),
            sortBy: sortBy,
            sortDirection: sortDirection,
        });

        if (status) {
            params.append('status', status);
        }
        if (term) {
            params.append('term', term);
        }

        const url = `/invoices/user/${userId}?${params.toString()}`;

        return await http.get(url, {
            next: { tags: [`invoice-${userId}`] }
        });
    }
}

export default invoiceService

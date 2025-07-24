import http from "@configs/fetch";
import { IPaymentRequest } from "@models/payment/request.model";

const paymentService = {
    paymentError: async (paymentId: string, data: IPaymentRequest) => {
        return await http.put(`/payments/error?paymentId=${paymentId}`, data)
    },

    paymentSuccess: async (paymentId: string, data: IPaymentRequest) => {
        return await http.put(`/payments/successful?paymentId=${paymentId}`, data)
    },

    paymentRemaining: async (invoiceId: string) => {
        return await http.post(`/payments/${invoiceId}/payos/remaining-amount`, {})
    }, 

    paymentRemainingSuccess: async (paymentId: string, data: IPaymentRequest) => {
        return await http.post(`/payments/remaining/successful?paymentId=${paymentId}`, data)
    }
}

export default paymentService;
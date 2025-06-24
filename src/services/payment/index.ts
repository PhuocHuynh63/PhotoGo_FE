import http from "@configs/fetch";
import { IPaymentRequest } from "@models/payment/request.model";

const paymentService = {
    paymentError: async (paymentId: string, data: IPaymentRequest) => {
        return await http.put(`/payments/error?paymentId=${paymentId}`, data)
    },

    paymentSuccess: async (paymentId: string, data: IPaymentRequest) => {
        return await http.put(`/payments/success?paymentId=${paymentId}`, data)
    }
}

export default paymentService;
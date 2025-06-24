import http from "@configs/fetch";
import { IPaymentErrorRequest } from "@models/payment/request.model";

const paymentService = {
    paymentError: async (paymentId: string, data: IPaymentErrorRequest) => {
        return await http.put(`/payments/error?paymentId=${paymentId}`, data)
    }
}

export default paymentService;
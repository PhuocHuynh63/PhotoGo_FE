import http from "@configs/fetch";
import { IPaymentErrorRequest } from "@models/payment/request.model";

const paymentService = {
    paymentError: async (data: IPaymentErrorRequest) => {
        return await http.put("/payments/error", data)
    }
}

export default paymentService;
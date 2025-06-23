import http from "@configs/fetch";
import { IPaymentErrorRequest } from "@models/payment/request.model";

const paymentService = {
    paymentError: (data: IPaymentErrorRequest) => {
        return http.post("/payments/error", data)
    }
}

export default paymentService;
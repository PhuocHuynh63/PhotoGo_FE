import http from "@configs/fetch";
import { IPaymentErrorRequest } from "@models/payment/request.model";

const paymentService = {
    paymentError: (data: IPaymentErrorRequest) => {
        return http.put("/payments/error", data)
    }
}

export default paymentService;
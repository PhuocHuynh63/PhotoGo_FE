import { IPaymentErrorRequest } from "@models/payment/request.model";
import paymentService from "@services/payment";
import { useState } from "react";

export async function usePaymentError(data: IPaymentErrorRequest) {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataPaymentError, setDataPaymentError] = useState<IPaymentErrorRequest | null>(null);

    try {
        setLoading(true);
        const res = await paymentService.paymentError(data) as any;

        if (res.status === 200) {
            
        }
    } catch (error) {

    } finally {
        setLoading(false);
    }



    return {
        data,
        loading,
    };
}
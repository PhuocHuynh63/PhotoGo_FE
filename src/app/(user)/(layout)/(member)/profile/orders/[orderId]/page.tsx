import { IBookingDetail } from "@models/booking/common.model";
import { IBookingResponseModel } from "@models/booking/repsonse.model";
import OrderDetails from "@pages/Member/Profile/Right/OrderDetails";
import BookingService from "@services/booking";

async function getBookingById(id: string) {
    const booking = await BookingService.getBookingById(id)
    return booking
}

interface OrdersProps {
    params: Promise<{ orderId: string }>
}

export default async function Orders({ params }: OrdersProps) {
    const { orderId } = await params || {};
    console.log(orderId)
    let booking = null;
    if (orderId) {
        booking = await getBookingById(orderId) as IBookingResponseModel
    }
    const bookingData = booking?.data as unknown as IBookingDetail
    return (
        <>
            <OrderDetails booking={bookingData} />
        </>
    )
}
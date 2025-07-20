import { authOptions } from "@lib/authOptions";
import { IBookingDetail } from "@models/booking/common.model";
import { IBookingResponseModel } from "@models/booking/repsonse.model";
import OrderDetails from "@pages/Member/Profile/Right/OrderDetails";
import { ROUTES } from "@routes";
import BookingService from "@services/booking";
import { METADATA } from "../../../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getBookingById(id: string) {
    const booking = await BookingService.getBookingById(id)
    return booking
}

interface OrdersProps {
    params: Promise<{ orderId: string }>
}

export default async function Orders({ params }: OrdersProps) {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    // const router = 
    const { orderId } = await params || {};
    let booking = null;
    if (orderId) {
        booking = await getBookingById(orderId) as IBookingResponseModel
    }

    if (booking?.data?.user?.id !== session?.user?.id) {
        redirect(ROUTES.PUBLIC.HOME);
    }

    const bookingData = booking?.data as unknown as IBookingDetail
    return (
        <>
            <OrderDetails booking={bookingData} />
        </>
    )
}
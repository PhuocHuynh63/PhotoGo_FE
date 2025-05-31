import CheckoutLayoutClient from "@components/Templates/CheckoutLayout";
import { authOptions } from "@lib/authOptions";
import { IBackendResponse } from "@models/backend/backendResponse.model";
import { ROUTES } from "@routes";
import checkoutSessionService from "@services/checkoutSession";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getCheckoutSession(id: string, userId: string) {
    return checkoutSessionService.getCheckoutSession(id, userId)
}

export default async function CheckoutLayout({
    children,
    params
}: SERVERS.CheckoutLayoutProps) {
    /**
     * Define variables
     */
    const { id } = await params;
    let errorMessage = "";
    //----------------------End----------------------//

    /**
     * Get session
     */
    const session = await getServerSession(authOptions) as METADATA.ISession;
    if (!session) {
        redirect(`${ROUTES.AUTH.LOGIN}?error=Bạn cần đăng nhập để thực hiện thao tác này.`);
    }
    const checkoutSession = await getCheckoutSession(id, session.user.id) as IBackendResponse<any>;

    if (checkoutSession.statusCode !== 200 && checkoutSession.statusCode !== 201) {
        errorMessage = checkoutSession.message || "Không tìm thấy thông tin thanh toán.";
        redirect(`${ROUTES.AUTH.LOGIN}?error=${errorMessage}`);
    }
    //----------------------End----------------------//

    return (
        <CheckoutLayoutClient errorMessage={errorMessage}>
            {children}
        </CheckoutLayoutClient>
    );
}

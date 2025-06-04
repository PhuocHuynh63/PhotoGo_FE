import CheckoutLayoutClient from "@components/Templates/CheckoutLayout";
import { authOptions } from "@lib/authOptions";
import { ICheckoutSessionResponseModel } from "@models/checkoutSession/repsonse.model";
import { IServiceConceptResponse } from "@models/concept/repsonse.model";
import { IUserResponse } from "@models/user/response.model";
import { ROUTES } from "@routes";
import checkoutSessionService from "@services/checkoutSession";
import conceptService from "@services/concept";
import packageService from "@services/packageServices";
import userService from "@services/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getCheckoutSession(id: string, userId: string) {
    return checkoutSessionService.getCheckoutSession(id, userId)
}

async function getAUser(id: string) {
    return userService.getAUser(id);
}

async function getConceptById(id: string) {
    return conceptService.getAServiceConceptById(id);
}

async function getPackageById(id: string) {
    return packageService.getPackageById(id);
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
    const checkoutSession = await getCheckoutSession(id, session.user.id) as ICheckoutSessionResponseModel;

    if (checkoutSession.statusCode !== 200 && checkoutSession.statusCode !== 201) {
        errorMessage = checkoutSession.message || "Không tìm thấy thông tin thanh toán.";
        redirect(`${ROUTES.AUTH.LOGIN}?error=${errorMessage}`);
    }
    //----------------------End----------------------//

    const user = await getAUser(session.user.id) as IUserResponse;

    /**
     *  Get concept and service package by conceptId from checkout session
     */
    const concept = await getConceptById(checkoutSession.data?.data.conceptId || "") as IServiceConceptResponse;
    const servicePackage = await getPackageById(concept.data.servicePackageId || "");
    //-----------------------End----------------------//


    return (
        <CheckoutLayoutClient checkoutSession={checkoutSession} user={user} concept={concept} servicePackage={servicePackage}>
            {children}
        </CheckoutLayoutClient>
    );
}

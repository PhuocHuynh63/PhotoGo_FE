export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import userService from "@services/user";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import Footer from "@components/Organisms/Footer";
import HeaderHomePage from "@components/Organisms/HeaderHomePage";
import { ICartResponse } from "@models/cart/response.model";
import cartService from "@services/cart";
import packageServices from "@services/packageServices";
import { IServicePackagesData } from "@models/servicePackages/response.model";
import { METADATA } from "../../../types/IMetadata";
import Chatbot from "@components/Molecules/Chatbot";

async function getAUser(id: string) {
    return await userService.getAUser(id);
}

async function getCartByUserId(userId: string) {
    return await cartService.getCartByUserId(userId);
}

async function getAllServicePackage() {
    return await packageServices.getAllServicePackage();
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    let userData: IUser | undefined;
    if (session?.user?.id) {
        const user = await getAUser(session.user.id) as IUserResponse;
        userData = user?.data as IUser | undefined;
    }
    const servicePackages = await getAllServicePackage();
    const servicePackagesData = servicePackages?.data as IServicePackagesData;
    let cart: ICartResponse;
    if (session?.user?.id) {
        cart = await getCartByUserId(session?.user?.id as string) as ICartResponse;
    } else {
        // Provide default cart when no session
        cart = {
            statusCode: 200,
            message: "No cart available",
            data: []
        };
    }
    return (
        <>
            <HeaderHomePage user={userData} cart={cart} servicePackages={servicePackagesData} />
            {children}
            <Chatbot />
            <Footer />
        </>
    );
}
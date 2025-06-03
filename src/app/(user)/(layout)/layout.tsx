export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import userService from "@services/user";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import Footer from "@components/Organisms/Footer";
import Header from "@components/Organisms/Header";
import cartService from "@services/cart";
import { ICartResponse } from "@models/cart/response.model";

async function getAUser(id: string) {
    return await userService.getAUser(id);
}

async function getCartByUserId(userId: string) {
    return await cartService.getCartByUserId(userId);
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

    const cart = await getCartByUserId(userData?.id as string) as ICartResponse;
    return (
        <>
            <Header user={userData} cart={cart} />
            {children}
            <Footer />
        </>
    );
}
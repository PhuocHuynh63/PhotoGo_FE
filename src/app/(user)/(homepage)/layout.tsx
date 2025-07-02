export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import userService from "@services/user";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import Footer from "@components/Organisms/Footer";
import HeaderHomePage from "@components/Organisms/HeaderHomePage";
import packageServices from "@services/packageServices";
import { IServicePackagesData } from "@models/servicePackages/response.model";
import { METADATA } from "../../../types/IMetadata";
import Chatbot from "@components/Molecules/Chatbot";

async function getAUser(id: string) {
    return await userService.getAUser(id);
}

async function getAllServicePackage(current: number = 1, pageSize: number = 10, showAll: boolean = true, sortBy: string = "createdAt", sortDirection: string = "asc") {
    return await packageServices.getAllServicePackage(current, pageSize, showAll, sortBy, sortDirection);
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
    const servicePackages = await getAllServicePackage(1, 1000, true, "createdAt", "asc");
    const servicePackagesData = servicePackages?.data as IServicePackagesData;
    return (
        <>
            <HeaderHomePage user={userData} servicePackages={servicePackagesData} />
            {children}
            <Chatbot />
            <Footer />
        </>
    );
}
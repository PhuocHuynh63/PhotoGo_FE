export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import userService from "@services/user";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import Footer from "@components/Organisms/Footer";
import Header from "@components/Organisms/Header";
import { IServicePackagesData } from "@models/servicePackages/response.model";
import packageServices from "@services/packageServices";
import { METADATA } from "../../../../types/IMetadata";
import Chatbot from "@components/Molecules/Chatbot";

async function getAUser(id: string) {
    return await userService.getAUser(id);
}

async function getAllServicePackage() {
    return await packageServices.getAllServicePackage();
}

export default async function GuestLayout({
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
    return (
        <>
            <Header user={userData} servicePackages={servicePackagesData} />
            {children}
            <Footer />
        </>
    );
}
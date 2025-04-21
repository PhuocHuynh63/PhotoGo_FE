export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import userService from "@services/user";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import Footer from "@components/Organisms/Footer";
import Header from "@components/Organisms/Header";

async function getAUser(id: string) {
    return await userService.getAUser(id);
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

    return (
        <>
            <Header user={userData} />
            {children}
            <Footer />
        </>
    );
}
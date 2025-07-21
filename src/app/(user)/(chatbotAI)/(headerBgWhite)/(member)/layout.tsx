import UserProfileLayoutClient from "@components/Templates/UserProfileLayout"
import { authOptions } from "@lib/authOptions";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import { ROUTES } from "@routes";
import userService from "@services/user";
import { METADATA } from "../../../../../types/IMetadata";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getAUser(id: string) {
    return await userService.getAUser(id);
}

export default async function UserProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    let userData: IUser | undefined;

    if (session?.user?.id) {
        const user = await getAUser(session.user.id) as IUserResponse;
        userData = user?.data as IUser | undefined;
    }

    if (!userData) {
        redirect(ROUTES.AUTH.LOGIN);
    }

    return (
        <>
            <UserProfileLayoutClient user={userData} >
                {children}
            </UserProfileLayoutClient>
        </>
    )
}


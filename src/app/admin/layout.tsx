import AdminLayoutClient from "@components/Templates/AdminLayout"
import { authOptions } from "@lib/authOptions";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import userService from "@services/user";
import { getServerSession } from "next-auth";

async function getAUser(id: string) {
    return await userService.getAUser(id);
}

export default async function AdminLayout({
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
        return null; 
    }

    return (
        <AdminLayoutClient session={session} userData={userData }>
            {children}
        </AdminLayoutClient>
    )
}
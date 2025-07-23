import { getServerSession } from "next-auth";
import { METADATA } from "../../../../../../types/IMetadata";
import { IUserResponse } from "@models/user/response.model";

import userService from "@services/user";
import { authOptions } from "@lib/authOptions";
import SubscriptionLayoutClient from "@components/Templates/SubscriptionLayout";

async function getUserById(userId: string) {
    return await userService.getAUser(userId);
}

export default async function SubscriptionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const user = await getUserById(session?.user?.id || '') as IUserResponse;
    return (
        <SubscriptionLayoutClient user={user.data || null}>
            {children}
        </SubscriptionLayoutClient>
    )
}
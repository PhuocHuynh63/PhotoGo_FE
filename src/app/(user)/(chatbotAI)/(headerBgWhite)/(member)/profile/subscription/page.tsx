import { IUser } from "@models/user/common.model"
import { authOptions } from "@lib/authOptions"
import { getServerSession } from "next-auth"
import userService from "@services/user"
import { IUserResponse } from "@models/user/response.model"
import { METADATA } from "../../../../../../../types/IMetadata"
import SubscriptionContent from "@pages/Member/Profile/Right/SubsciptionContent"

async function getAUser(id: string) {
    return await userService.getAUser(id);
}


export default async function Subscription() {
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
        <SubscriptionContent user={userData} />
    )
}
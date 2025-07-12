import { authOptions } from "@lib/authOptions";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import RewardsPage from "@pages/Member/Profile/Right/RewardsContent"
import userService from "@services/user";
import { METADATA } from "../../../../../../../types/IMetadata";
import { getServerSession } from "next-auth";

async function getAUser(id: string) {
    return await userService.getAUser(id);
}


export default async function Rewards() {
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
        <>
            <RewardsPage user={userData} />
        </>
    )
}
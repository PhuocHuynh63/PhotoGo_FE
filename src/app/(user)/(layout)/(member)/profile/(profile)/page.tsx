import ProfileContent from "@pages/Member/Profile/Right/ProfileContent"
import { IUser } from "@models/user/common.model"
import { authOptions } from "@lib/authOptions"
import { getServerSession } from "next-auth"
import userService from "@services/user"
import { IUserResponse } from "@models/user/response.model"

async function getAUser(id: string) {
    return await userService.getAUser(id);
}

export default async function Profile() {
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
        <ProfileContent user={userData} />
    )
}
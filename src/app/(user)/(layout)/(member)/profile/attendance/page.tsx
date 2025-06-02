import { authOptions } from "@lib/authOptions";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import AttendancePage from "@pages/Member/Profile/Right/AttendanceContent"
import userService from "@services/user";
import { getServerSession } from "next-auth";

async function getAUser(id: string) {
    return await userService.getAUser(id);
}

export default async function ChangePassword() {

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
            <AttendancePage isLoggedIn={true} userId={userData?.id} />
        </>
    )
}


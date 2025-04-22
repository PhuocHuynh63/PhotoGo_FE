import UserProfileLayout from "@components/Templates/UserProfileLayout";
import { authOptions } from "@lib/authOptions";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import userService from "@services/user";
import { getServerSession } from "next-auth";


async function getAUser(id: string) {
    return await userService.getAUser(id);
}

export default async function Profile() {

    const session = await getServerSession(authOptions) as METADATA.ISession;
    let userData: IUser | undefined;
    const userOrders: any[] = [];
    const userFavorites: any[] = [];
    const userPromotions: any[] = [];

    if (session?.user?.id) {
        const user = await getAUser(session.user.id) as IUserResponse;
        userData = user?.data as IUser | undefined;

        // userOrders = await getUserOrders(session.user.id);
        // userFavorites = await getUserFavorites(session.user.id);
        // userPromotions = await getUserPromotions(session.user.id);
    }
    return (
        <>
            <UserProfileLayout
                userToken={session?.accessToken}
                user={userData}
                userOrders={userOrders}
                userFavorites={userFavorites}
                userPromotions={userPromotions}>

            </UserProfileLayout>
        </>
    );
}

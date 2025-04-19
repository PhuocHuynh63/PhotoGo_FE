import { authOptions } from "@lib/authOptions";
import { IUser } from "@models/user/common.model";
import { IUserResponse } from "@models/user/response.model";
import ProfilePage from "@pages/Member/Profile";
import userService from "@services/user";
import { getServerSession } from "next-auth";

async function getAUser(id: string) {
    return await userService.getAUser(id);
}

async function getUserOrders(id: string) {
    // return await userService.getUserOrders(id);
}

async function getUserFavorites(id: string) {
    // return await userService.getUserFavorites(id);
}

async function getUserPromotions(id: string) {
    // return await userService.getUserPromotions(id);
}

export default async function Profile() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    let userData: IUser | undefined;
    let userOrders: any[] = [];
    let userFavorites: any[] = [];
    let userPromotions: any[] = [];

    if (session?.user?.id) {
        const user = await getAUser(session.user.id) as IUserResponse;
        userData = user?.data as IUser | undefined;

        userOrders = await getUserOrders(session.user.id);
        userFavorites = await getUserFavorites(session.user.id);
        userPromotions = await getUserPromotions(session.user.id);
    }

    return (
        <>
            <ProfilePage
                user={userData}
                userOrders={userOrders}
                userFavorites={userFavorites}
                userPromotions={userPromotions}
            />
        </>
    );
}
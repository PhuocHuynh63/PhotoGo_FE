import { authOptions } from "@lib/authOptions";
import { IFavoriteDetailModel } from "@models/favorite/common.model";
import { IFavoriteListResponse } from "@models/favorite/response.model";
import FavoritesPage from "@pages/Member/Profile/Right/FavoriteContent"
import favoritesService from "@services/favorites";
import { getServerSession } from "next-auth";

async function getFavorites(userId: string) {
    const response = await favoritesService.getFavoriteList(userId)
    return response;
}

export default async function Favorites() {
    const session = await getServerSession(authOptions) as METADATA.ISession;
    const favorites = await getFavorites(session.user.id) as IFavoriteListResponse
    const itemsData = favorites.data?.items as IFavoriteDetailModel[]
    return (
        <>
            <FavoritesPage itemsData={itemsData} />
        </>
    )
}
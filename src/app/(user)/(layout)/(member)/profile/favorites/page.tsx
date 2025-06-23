import { authOptions } from "@lib/authOptions";
import { IFavoriteDetailModel } from "@models/favorite/common.model";
import { IFavoriteListResponse } from "@models/favorite/response.model";
import FavoritesPage from "@pages/Member/Profile/Right/FavoriteContent"
import favoritesService from "@services/favorites";
import { getServerSession } from "next-auth";

interface FavoritesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getFavorites(userId: string, searchParams: { page?: string }) {
    const resolvedParams = await searchParams;

    const queryParams = new URLSearchParams();
    queryParams.append('current', resolvedParams.page || '1');
    queryParams.append('pageSize', '6');
    queryParams.append('sortBy', 'created_at');
    queryParams.append('sortType', 'DESC');

    const response = await favoritesService.getFavoriteList(userId, queryParams)
    return response;
}

export default async function Favorites({ searchParams }: FavoritesPageProps) {
    const session = await getServerSession(authOptions) as METADATA.ISession;

    const resolvedParams = await searchParams;

    const favorites = await getFavorites(session.user.id, resolvedParams) as IFavoriteListResponse;
    const itemsData = (favorites.data?.data[0]?.items || []) as unknown as IFavoriteDetailModel[];
    const favoritePagination = favorites.data?.pagination || { current: 1, pageSize: 6, totalPage: 1, totalItem: 0 };

    return (
        <>
            <FavoritesPage itemsData={itemsData} favoritePagination={favoritePagination} />
        </>
    )
}
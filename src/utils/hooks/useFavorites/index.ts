import { useState, useEffect } from 'react';
import { useSession } from '@stores/user/selectors';
import favoritesService from '@services/favorites';
import { IFavoriteDetailModel } from '@models/favorite/common.model';
import { IFavoriteListResponse, IAddFavoriteResponse } from '@models/favorite/response.model';
import toast from 'react-hot-toast';

export const useFavorites = () => {
    const session = useSession();
    const userId = session?.user?.id;
    const wishlistId = session?.user?.wishlistId;

    const [favorites, setFavorites] = useState<IFavoriteDetailModel[]>([]);
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
    const [isAddingToFavorite, setIsAddingToFavorite] = useState(false);
    const [isRemovingFromFavorite, setIsRemovingFromFavorite] = useState(false);

    // Fetch favorites when component mounts or userId changes
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!userId) return;

            try {
                setIsLoadingFavorites(true);
                const response = await favoritesService.getFavoriteList(userId) as IFavoriteListResponse;
                if (response?.data?.data?.[0]?.items) {
                    setFavorites(response.data.data[0].items as unknown as IFavoriteDetailModel[]);
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setIsLoadingFavorites(false);
            }
        };

        fetchFavorites();
    }, [userId]);

    // Check if a concept is in favorites
    const isConceptInFavorites = (conceptId: string) => {
        return favorites.some((favorite: IFavoriteDetailModel) => favorite.serviceConceptId === conceptId);
    };

    // Get favorite item by concept ID
    const getFavoriteItem = (conceptId: string) => {
        return favorites.find((favorite: IFavoriteDetailModel) => favorite.serviceConceptId === conceptId);
    };

    // Add concept to favorites
    const addToFavorites = async (conceptId: string) => {
        try {
            if (!userId) {
                toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
                return false;
            }

            if (!wishlistId) {
                toast.error("Không tìm thấy danh sách yêu thích");
                return false;
            }

            if (isConceptInFavorites(conceptId)) {
                toast.error("Sản phẩm đã được thêm vào yêu thích");
                return false;
            }

            setIsAddingToFavorite(true);
            const response = await favoritesService.addFavorite(wishlistId, conceptId) as IAddFavoriteResponse;

            if (response?.statusCode === 201) {
                toast.success("Đã thêm vào yêu thích");
                // Refresh favorites list
                const updatedResponse = await favoritesService.getFavoriteList(userId) as IFavoriteListResponse;
                if (updatedResponse?.data?.data?.[0]?.items) {
                    setFavorites(updatedResponse.data.data[0].items as unknown as IFavoriteDetailModel[]);
                }
                return true;
            } else {
                toast.error("Đã xảy ra lỗi khi thêm vào yêu thích");
                return false;
            }
        } catch (error) {
            console.error('Error in addToFavorites:', error);
            toast.error("Đã xảy ra lỗi khi thêm vào yêu thích");
            return false;
        } finally {
            setIsAddingToFavorite(false);
        }
    };

    // Remove concept from favorites
    const removeFromFavorites = async (conceptId: string) => {
        try {
            if (!userId) {
                toast.error("Vui lòng đăng nhập để xóa khỏi yêu thích");
                return false;
            }

            const favoriteItem = getFavoriteItem(conceptId);
            if (!favoriteItem) {
                toast.error("Không tìm thấy sản phẩm trong danh sách yêu thích");
                return false;
            }

            setIsRemovingFromFavorite(true);
            await favoritesService.removeFavorite(favoriteItem.wishlistId, favoriteItem.id);

            // Remove from local state immediately for better UX
            setFavorites(prev => prev.filter(item => item.serviceConceptId !== conceptId));
            toast.success("Đã xóa khỏi danh sách yêu thích");
            return true;
        } catch (error) {
            console.error('Error in removeFromFavorites:', error);
            toast.error("Đã xảy ra lỗi khi xóa khỏi yêu thích");
            return false;
        } finally {
            setIsRemovingFromFavorite(false);
        }
    };

    // Toggle favorite (add if not exists, remove if exists)
    const toggleFavorite = async (conceptId: string) => {
        if (isConceptInFavorites(conceptId)) {
            return await removeFromFavorites(conceptId);
        } else {
            return await addToFavorites(conceptId);
        }
    };

    // Refresh favorites list
    const refreshFavorites = async () => {
        if (!userId) return;

        try {
            setIsLoadingFavorites(true);
            const response = await favoritesService.getFavoriteList(userId) as IFavoriteListResponse;
            if (response?.data?.data?.[0]?.items) {
                setFavorites(response.data.data[0].items as unknown as IFavoriteDetailModel[]);
            }
        } catch (error) {
            console.error('Error refreshing favorites:', error);
        } finally {
            setIsLoadingFavorites(false);
        }
    };

    return {
        favorites,
        isLoadingFavorites,
        isAddingToFavorite,
        isRemovingFromFavorite,
        isConceptInFavorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        refreshFavorites,
        userId,
        wishlistId
    };
}; 
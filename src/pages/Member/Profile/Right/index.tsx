// src/pages/Member/Profile/Right/index.tsx
import RewardsContent from "./RewardsContent"
import ProfileContent from "./ProfileContent"
import OrdersContent from "./OrderContent"
import FavoritesContent from "./FavoriteContent"
import PromotionsContent from "./PromotionContent"
import { PAGES } from '../../../../types/IPages'
import React from 'react';
import PointsPage from "./PointContent"
import ChangePasswordForm from "./ChangePasswordContent"

const ProfileRight: React.FC<PAGES.ProfileRightProps> = ({ userToken, user, activeTab, userOrders, userFavorites, userPromotions }) => {
    console.log('right' + user)

    const renderContent = () => {
        if (!user) {
            return <div>No user data available</div>;
        }

        switch (activeTab) {
            case "profile":
                return <ProfileContent user={user} userToken={userToken} />;
            case "rewards":
                return <RewardsContent user={user} />
            case "orders":
                return <OrdersContent /*userOrders={userOrders} userFavorites={userFavorites} userPromotions={userPromotions}*/ />
            case "favorites":
                return <FavoritesContent /*favorites={userFavorites}*/ />
            case "promotions":
                return <PromotionsContent /*promotions={userPromotions}*/ />
            case "points":
                return <PointsPage />
            case "change-password":
                return <ChangePasswordForm />
            default:
                return <RewardsContent user={user} />
        }
    }

    return (
        <div className="flex-1 flex flex-col justify-center items-center">
            <div className="container mx-auto">{renderContent()}</div>
        </div>
    )
}

export default ProfileRight;
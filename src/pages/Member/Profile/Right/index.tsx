// src/pages/Member/Profile/Right/index.tsx
import RewardsContent from "../components/RewardsContent"
import ProfileContent from "../components/ProfileContent"
import OrdersContent from "../components/OrderContent"
import FavoritesContent from "../components/FavoriteContent"
import PromotionsContent from "../components/PromotionContent"
import { PAGES } from '../../../../types/IPages'
import React from 'react';
import PointsPage from "../components/PointContent/PointContent"

const ProfileRight: React.FC<PAGES.ProfileRightProps> = ({ user, activeTab, userOrders, userFavorites, userPromotions }) => {
    console.log('right' + user)

    const renderContent = () => {
        if (!user) {
            return <div>No user data available</div>;
        }

        switch (activeTab) {
            case "profile":
                return <ProfileContent user={user} />
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
            default:
                return <RewardsContent user={user} />
        }
    }

    return (
        <div className="flex-1">
            <div className="max-w-5xl mx-auto">{renderContent()}</div>
        </div>
    )
}

export default ProfileRight;
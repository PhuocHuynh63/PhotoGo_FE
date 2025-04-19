// src/pages/Member/Profile/Right/index.tsx
import RewardsContent from "../components/RewardsContent"
import ProfileContent from "../components/ProfileContent"
import OrdersContent from "../components/OrderContent"
import FavoritesContent from "../components/FavoriteContent"
import PromotionsContent from "../components/PromotionContent"
import { PAGES } from '../../../../types/IPages'
import React from 'react';

const ProfileRight: React.FC<PAGES.ProfileRightProps> = ({ user, activeTab, userOrders, userFavorites, userPromotions }) => {
    console.log(user)

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileContent user={user} />
            case "rewards":
                return <RewardsContent user={user} />
            case "orders":
                return <OrdersContent orders={userOrders} />
            case "favorites":
                return <FavoritesContent favorites={userFavorites} />
            case "promotions":
                return <PromotionsContent promotions={userPromotions} />
            default:
                return <RewardsContent user={user} />
        }
    }

    return (
        <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </div>
    )
}

export default ProfileRight;
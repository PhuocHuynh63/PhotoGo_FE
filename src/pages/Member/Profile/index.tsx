"use client"

import { useState } from "react"
import ProfileLeft from "./Left"
import ProfileRight from "./Right"

import { PAGES } from "../../../types/IPages"

export default function ProfilePage({ user, userOrders, userFavorites, userPromotions }: PAGES.IProfile & { userOrders: any[], userFavorites: any[], userPromotions: any[] }) {
    const [activeTab, setActiveTab] = useState("rewards")

    return (
        <div className="container mx-auto min-h-screen mt-20 p-4">
            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="md:w-1/4">
                    <ProfileLeft user={user} setActiveTab={setActiveTab} activeTab={activeTab} />
                </div>
                <div className="md:w-3/4">
                    <ProfileRight user={user} activeTab={activeTab} userOrders={userOrders} userFavorites={userFavorites} userPromotions={userPromotions} />
                </div>
            </div>
        </div>
    )
}

// Profile Content Component


// Rewards Content Component


// Orders Content Component


// Favorites Content Component


// Promotions Content Component


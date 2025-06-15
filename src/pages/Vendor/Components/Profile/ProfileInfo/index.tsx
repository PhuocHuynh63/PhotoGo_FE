"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Atoms/ui/tabs"
import { PAGES } from "../../../../../types/IPages"

// Import child components
import ProfileHeader from "@pages/Vendor/Components/Profile/ProfileInfo/components/ProfileHeader"
import BasicInfo from "@pages/Vendor/Components/Profile/ProfileInfo/components/BasicInfo"
import DisplaySettingsComponent from "@pages/Vendor/Components/Profile/ProfileInfo/components/DisplaySettings"
import ServicesTab from "@pages/Vendor/Components/Profile/ProfileInfo/components/ServicesTab"
import PricingTab from "@pages/Vendor/Components/Profile/ProfileInfo/components/PricingTab"

interface DisplaySettings {
    showProfile: boolean;
    showLocation: boolean;
    emailNotifications: boolean;
}

export default function ProfileInfo({ profileData }: PAGES.IVendorProfileInfoProps) {
    // Initialize default settings since vendor model doesn't have settings
    const [settings, setSettings] = useState<DisplaySettings>({
        showProfile: true,
        showLocation: true,
        emailNotifications: false,
    })

    // State for services pagination
    const [visibleServicesCount, setVisibleServicesCount] = useState(3) // Show 3 services initially
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const SERVICES_PER_LOAD = 3 // Load 3 more services each time

    const handleSettingChange = (setting: keyof DisplaySettings, value: boolean) => {
        setSettings((prev: DisplaySettings) => ({
            ...prev,
            [setting]: value,
        }))
    }

    const handleLoadMoreServices = () => {
        setIsLoadingMore(true)
        // Simulate loading delay
        setTimeout(() => {
            setVisibleServicesCount(prev => prev + SERVICES_PER_LOAD)
            setIsLoadingMore(false)
        }, 500)
    }

    // Calculate completion percentage based on available data
    const calculateCompletionPercentage = () => {
        let completedFields = 0
        const totalFields = 8

        if (profileData?.name) completedFields++
        if (profileData?.description) completedFields++
        if (profileData?.logo) completedFields++
        if (profileData?.user_id?.email) completedFields++
        if (profileData?.user_id?.phoneNumber) completedFields++
        if (profileData?.locations?.length > 0) completedFields++
        if (profileData?.servicePackages?.length > 0) completedFields++
        if (profileData?.category) completedFields++

        return Math.round((completedFields / totalFields) * 100)
    }

    // Calculate min/max prices from all service concepts
    const calculateConceptPriceRange = () => {
        if (!profileData?.servicePackages?.length) return null

        const allPrices: number[] = []

        profileData.servicePackages.forEach(servicePackage => {
            servicePackage.serviceConcepts?.forEach(concept => {
                const price = parseFloat(concept.price)
                if (!isNaN(price)) {
                    allPrices.push(price)
                }
            })
        })

        if (allPrices.length === 0) return null

        return {
            minPrice: Math.min(...allPrices),
            maxPrice: Math.max(...allPrices)
        }
    }

    const conceptPriceRange = calculateConceptPriceRange()
    const completionPercentage = calculateCompletionPercentage()

    return (
        <div className="p-6">
            <ProfileHeader
                profileData={profileData}
                completionPercentage={completionPercentage}
            />

            <Tabs defaultValue="info">
                <TabsList className="mb-4">
                    <TabsTrigger className="cursor-pointer" value="info">Thông tin cơ bản</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="services">Dịch vụ</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="pricing">Bảng giá</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-6">
                    <BasicInfo
                        profileData={profileData}
                        conceptPriceRange={conceptPriceRange}
                    />

                    <DisplaySettingsComponent
                        settings={settings}
                        onSettingChange={handleSettingChange}
                    />
                </TabsContent>

                <TabsContent value="services">
                    <ServicesTab
                        profileData={profileData}
                        visibleServicesCount={visibleServicesCount}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={handleLoadMoreServices}
                    />
                </TabsContent>

                <TabsContent value="pricing">
                    <PricingTab
                        profileData={profileData}
                        visibleServicesCount={visibleServicesCount}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={handleLoadMoreServices}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

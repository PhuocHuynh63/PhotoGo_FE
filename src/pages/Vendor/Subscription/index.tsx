"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Atoms/ui/tabs"
import { IVendor } from "@models/vendor/common.model"
import CurrentPlan from "../Components/Subscription/CurrentPlan"
import SubscriptionHistory from "../Components/Subscription/SubscriptionHistory"
import AvailablePlans from "../Components/Subscription/AvailablePlans"

interface SubscriptionData {
    currentPlan: any
    subscriptionHistory: any[]
    availablePlans: any[]
}

interface SubscriptionManagementProps {
    data: SubscriptionData
    vendor: IVendor
}

export default function SubscriptionManagement({ data, vendor }: SubscriptionManagementProps) {
    const [activeTab, setActiveTab] = useState("current")
    
    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="current">Gói hiện tại</TabsTrigger>
                    <TabsTrigger value="history">Lịch sử ({data?.subscriptionHistory?.length})</TabsTrigger>
                    <TabsTrigger value="plans">Nâng cấp</TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="mt-6">
                    <CurrentPlan plan={data?.currentPlan} />
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                    <SubscriptionHistory history={data?.subscriptionHistory} />
                </TabsContent>

                <TabsContent value="plans" className="mt-6">
                    <AvailablePlans plans={data?.availablePlans} currentPlan={data?.currentPlan} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

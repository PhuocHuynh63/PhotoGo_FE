"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/Atoms/ui/carousel";
import RankCard from "../../components/RankCard";
import ProgressSection from "../../components/ProgressSection";
import BenefitsList from "../../components/BenefitsList";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const mockData = [{
    level: 0,
    name: "Đồng",
    gradient: "from-[#b87333] via-[#d49a6a] to-[#8c6239]",
    current: false,
    spentGoal: 0,
    spentVND: "0",
    orderGoal: 0,
    deadline: "31/12/2023",
    reward: "0",
    description: "Bắt đầu hành trình với PhotoGo Rewards",
},
{
    level: 1,
    name: "Bạc",
    gradient: "from-[#b0b0b0] via-[#e0e0e0] to-[#8c8c8c]",
    current: false,
    spentGoal: 1000,
    spentVND: "10,000,000",
    orderGoal: 5,
    deadline: "31/12/2023",
    reward: "100000",
    description: "Đặt 5 đơn hàng hoặc chi tiêu 1000 USD trong tháng này",
},
{
    level: 2,
    name: "Vàng",
    gradient: "from-[#d4af37] via-[#f7e27e] to-[#b8860b]",
    current: false,
    spentGoal: 2000,
    spentVND: "20,000,000",
    orderGoal: 10,
    deadline: "31/12/2023",
    reward: "200000",
    description: "Đặt 10 đơn hàng hoặc chi tiêu 2000 USD trong tháng này",
},
{
    level: 3,
    name: "Kim Cương",
    gradient: "from-[#1d9cd8] via-[#38c3ec] to-[#0f70b7]",
    current: false,
    spentGoal: 4000,
    spentVND: "40,000,000",
    orderGoal: 20,
    deadline: "31/12/2023",
    reward: "400000",
    description: "Đặt 20 đơn hàng hoặc chi tiêu 4000 USD trong tháng này",
    btnText: "Nâng hạng"
}]

interface User {
    rank?: string;
}

export default function RewardsContent({ user }: { user: User }) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const userRank = user?.rank?.toLowerCase() || 'đồng'; // Default to 'đồng' if no rank

    // Update current rank based on user's rank
    const updatedMockData = mockData.map(rank => ({
        ...rank,
        current: rank.name.toLowerCase() === userRank
    }));

    useEffect(() => {
        if (carouselApi) {
            const currentIndex = updatedMockData.findIndex((item) => item.current);
            if (currentIndex !== -1) {
                const timer = setTimeout(() => {
                    carouselApi.scrollTo(currentIndex, false);
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [carouselApi, updatedMockData]);

    return (
        <div className="">
            {/* Photo Rewards Header */}
            <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            fill="#8B5CF6"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-purple-700">
                    PhotoGo <span className="font-normal">Rewards</span>
                </h1>
            </div>

            <p className="text-gray-600 mb-6">Nhận thưởng từ mỗi chuyến du lịch cùng và vận ưu đãi độc quyền</p>

            {/* Membership Levels */}
            <h1 className="text-2xl font-bold mb-6">Mức Rank</h1>
            <div className="flex justify-center">
                <div className="w-full">
                    <Carousel setApi={setCarouselApi}>
                        <div className="absolute z-10 top-0 right-0 w-6 h-full rounded-l-md rounded-r-md" style={{ background: 'linear-gradient(to left, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0))' }}>
                        </div>
                        <div className="absolute z-10 top-0 left-0 w-6 h-full rounded-r-md rounded-l-md" style={{ background: 'linear-gradient(to right, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0))' }}>
                        </div>
                        {/* <CarouselPrevious /> */}
                        <CarouselContent className="my-4">
                            {updatedMockData.map((level, index) => (
                                <CarouselItem
                                    key={index}
                                    className={`transition-all duration-300 ${level.current ? "opacity-100" : "opacity-40"
                                        }`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <RankCard level={level} />
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {/* <CarouselNext /> */}
                    </Carousel>
                </div>
            </div>
            {/* Progress Section */}
            <div className="my-8">
                <ProgressSection required={1000} spent={500} />
            </div>

            {/* Member Benefits Section */}
            <div className="my-8">
                <BenefitsList />
            </div>
        </div>
    )
}
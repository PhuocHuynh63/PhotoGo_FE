import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/Atoms/ui/carousel";
import { ChevronRight } from "lucide-react";
import { RankCard } from "../../components/RewardComponents/RankCard";
import { ProgressSection } from "../../components/RewardComponents/ProgressSection";
import { BenefitsList } from "../../components/RewardComponents/BenefitsList";

const mockData = [{
    level: 1,
    name: "Bạc",
    gradient: "from-gray-300 to-gray-500",
    current: false,
    spentGoal: 1000,
    spentVND: "10,000,000",
    orderGoal: 5,
    deadline: "31/12/2023",
    reward: "100000",
    description: "Đặt 5 đơn hàng hoặc chi tiêu 1000 USD trong tháng này",
    btnText: "Nâng hạng"
},
{
    level: 2,
    name: "Vàng",
    gradient: "from-yellow-300 to-yellow-500",
    current: true,
    spentGoal: 2000,
    spentVND: "20,000,000",
    orderGoal: 10,
    deadline: "31/12/2023",
    reward: "200000",
    description: "Đặt 10 đơn hàng hoặc chi tiêu 2000 USD trong tháng này",
    btnText: "Nâng hạng"
},
{
    level: 3,
    name: "Kim Cương",
    gradient: "from-gray-300 to-gray-500",
    current: false,
    spentGoal: 4000,
    spentVND: "40,000,000",
    orderGoal: 20,
    deadline: "31/12/2023",
    reward: "400000",
    description: "Đặt 20 đơn hàng hoặc chi tiêu 4000 USD trong tháng này",
    btnText: "Nâng hạng"
}
]

export default function RewardsContent({ user }: any) {
    return (
        <div className="container mx-auto">
            {/* Photo Rewards Header */}
            <div className="flex items-center my-8">
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
                <div className="w-3/4">
                    <Carousel>
                        <div className="absolute z-10 top-0 right-0 w-6 h-full rounded-l-md" style={{ background: 'linear-gradient(to left, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0))' }}>
                        </div>
                        <div className="absolute z-10 top-0 left-0 w-6 h-full rounded-r-md" style={{ background: 'linear-gradient(to right, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0))' }}>
                        </div>
                        <CarouselPrevious />
                        <CarouselContent className="my-4">
                            {mockData.map((level, index) => (
                                <CarouselItem
                                    key={index}
                                    className={`transition-all duration-300 ${level.current ? "opacity-100 shadow-lg border-2 rounded-xl border-primary" : "opacity-40 pointer-events-none"}`}
                                >
                                    <RankCard level={level} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNext />
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
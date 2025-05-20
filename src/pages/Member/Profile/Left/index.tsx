'use client'

import { Card, CardContent } from "@components/Atoms/Card"
import { Avatar } from "@components/Molecules/Avatar"
import {
    ChevronRight, Ticket, Wallet, Star, ShoppingBag,
    MessageSquare, Heart, KeyRound
} from "lucide-react"
import { PAGES } from '../../../../types/IPages'
import Button from "@components/Atoms/Button"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"

const menuItems = [
    { tab: "promotions", label: "Mã ưu đãi", icon: Ticket },
    { tab: "points", label: "Điểm tích lũy", icon: Wallet },
    { tab: "rewards", label: "PhotoGo Rewards", icon: Star },
    { tab: "orders", label: "Đơn hàng", icon: ShoppingBag },
    { tab: "reviews", label: "Đánh giá", icon: MessageSquare },
    { tab: "favorites", label: "Yêu thích", icon: Heart },
    { tab: "change-password", label: "Thay đổi mật khẩu", icon: KeyRound },
];

const getRankGradient = (rank: string) => {
    switch (rank.toLowerCase()) {
        case 'đồng':
            return 'from-amber-600 to-amber-800';
        case 'bạc':
            return 'from-gray-300 to-gray-500';
        case 'vàng':
            return 'from-yellow-300 to-yellow-500';
        case 'kim cương':
            return 'from-blue-300 to-blue-500';
        default:
            return 'from-gray-100 to-gray-200'; // Default gradient for users with no rank
    }
};

const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
        case 'đồng':
            return '#B45309'; // amber-600
        case 'bạc':
            return '#6B7280'; // gray-500
        case 'vàng':
            return '#EAB308'; // yellow-500
        case 'kim cương':
            return '#3B82F6'; // blue-500
        default:
            return '#49C4D2'; // Default color
    }
};

const ProfileLeft: React.FC<PAGES.ProfileLeftProps> = ({ user }) => {
    const router = useRouter();
    const pathname = usePathname();
    const currentTab = pathname?.split('/').pop() || 'profile';
    const userRank = user?.rank || ''; // Use empty string if no rank
    const gradientClass = getRankGradient(userRank);

    return (
        <div className="w-full mb-10 rounded-lg shadow-lg bg-white">
            {/* User Profile */}
            <div className={`bg-gradient-to-b ${gradientClass} p-5 rounded-lg`}>
                <div className="flex flex-col items-center justify-center">
                    <Avatar className="w-2 rounded-full" src={user?.avatarUrl || 'https://res.cloudinary.com/dodtzdovx/image/upload/v1745322627/c3-1683876188-612-width800height700_b7jtxt.jpg'} alt={user?.fullName || 'User'} size={100} />
                    <h2 className="mt-3 text-xl font-bold">{user?.fullName || 'Unknown User'}</h2>
                    <Button
                        className={`my-2 flex items-center text-sm line-clamp-1 opacity-90 bg-none bd-none shadow-none hover:bg-none ${currentTab === "profile" ? "text-dark bg-white p-1" : ""}`}
                        onClick={() => router.push('/profile')}
                    >
                        Cập nhật thông tin cá nhân <ChevronRight size={16} />
                    </Button>

                    <Card className="w-full bg-white text-gray-800 rounded-lg">
                        <CardContent className="flex items-center justify-center flex-col">
                            <div className="w-28 h-7 my-2 inline-flex items-stretch border rounded-full overflow-hidden" style={{ borderColor: getRankColor(userRank) }}>
                                <div className="relative text-white mx-auto my-auto text-sm font-bold border-r-0">
                                    <div className="text-sm font-bold" style={{ color: getRankColor(userRank) }}>{userRank || 'Chưa có rank'}</div>
                                </div>
                            </div>

                            <Button
                                className="text-blue-400 flex items-center text-sm line-clamp-1 opacity-90 bg-none bd-none shadow-none hover:bg-none"
                                onClick={() => router.push('/profile/rewards')}
                            >
                                Xem ưu đãi thành viên <ChevronRight size={14} />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4">
                <motion.ul
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: { staggerChildren: 0.08 }
                        },
                        hidden: {}
                    }}
                >
                    {menuItems.map(({ tab, label, icon: Icon }) => (
                        <motion.li
                            key={tab}
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 1 }}
                            className={["orders", "reviews", "favorites", "change-password"].includes(tab) && tab === "orders" ? "pt-3 border-t" : ""}
                        >
                            <Button
                                onClick={() => router.push(`/profile/${tab}`)}
                                className={`{bg-none shadow-none hover:bg-none ${currentTab === tab
                                    ? "text-primary font-medium"
                                    : "text-gray-700 hover:text-primary"}`}
                            >
                                <Icon className={`w-5 h-5 mr-3`} />
                                <span>{label}</span>
                            </Button>
                        </motion.li>
                    ))}
                </motion.ul>
            </nav>
        </div>
    )
}

export default ProfileLeft;

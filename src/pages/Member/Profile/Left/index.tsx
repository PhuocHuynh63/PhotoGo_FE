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

const menuItems = [
    { tab: "promotions", label: "Mã ưu đãi", icon: Ticket },
    { tab: "points", label: "Điểm tích lũy", icon: Wallet },
    { tab: "rewards", label: "PhotoGo Rewards", icon: Star },
    { tab: "orders", label: "Đơn hàng", icon: ShoppingBag },
    { tab: "reviews", label: "Đánh giá", icon: MessageSquare },
    { tab: "favorites", label: "Yêu thích", icon: Heart },
    { tab: "change-password", label: "Thay đổi mật khẩu", icon: KeyRound },
];

const ProfileLeft: React.FC<PAGES.ProfileLeftProps> = ({ user, activeTab, setActiveTab }) => {
    return (
        <div className="w-full mb-10 rounded-lg shadow-lg bg-white">
            {/* User Profile */}
            <div className="bg-gradient-to-b from-orange-300 to-yellow-50 p-5 text-white rounded-lg">
                <div className="flex flex-col items-center justify-center">
                    <Avatar className="w-24 h-24 rounded-full" src={user?.avatarUrl || '/default-avatar.png'} alt={user?.fullName || 'User'} />
                    <h2 className="mt-3 text-xl font-bold">{user?.fullName || 'Unknown User'}</h2>
                    <Button className={`my-2 flex items-center text-sm line-clamp-1 opacity-90 bg-none bd-none shadow-none hover:bg-none ${activeTab === "profile" ? "text-dark bg-gray-200 p-1" : ""}`} onClick={() => setActiveTab("profile")}>
                        Cập nhật thông tin cá nhân <ChevronRight size={16} />
                    </Button>

                    <Card className="w-full bg-white text-gray-800 rounded-lg">
                        <CardContent className="flex items-center justify-center flex-col">
                            <div className="w-28 h-7 my-2 inline-flex items-stretch border border-[#49C4D2] rounded-full overflow-hidden">
                                <div className="relative bg-[#49C4D2] text-white px-4 py-1 text-sm font-bold border-r-0">
                                    Lv.1
                                    <div className="absolute top-0 right-[-1px] h-full w-2 bg-white"
                                        style={{ clipPath: 'polygon(0% 0, 100% 0, 100% 100%)' }} />
                                </div>
                                <div className="text-[#49C4D2] px-4 py-1 text-sm font-bold bg-white">Bạc</div>
                            </div>

                            <Button
                                className="text-blue-400 flex items-center text-sm line-clamp-1 opacity-90 bg-none bd-none shadow-none hover:bg-none"
                                onClick={() => setActiveTab("rewards")}
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
                            transition={{ duration: 3 }}
                            className={["orders", "reviews", "favorites", "change-password"].includes(tab) && tab === "orders" ? "pt-3 border-t" : ""}
                        >
                            <Button
                                onClick={() => setActiveTab(tab)}
                                className={`{bg-none shadow-none hover:bg-none ${activeTab === tab
                                    ? "text-blue-500 font-medium"
                                    : "text-gray-700 hover:text-blue-500"}`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${activeTab === "rewards" && tab === "rewards" ? "fill-orange-500" : ""}`} />
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

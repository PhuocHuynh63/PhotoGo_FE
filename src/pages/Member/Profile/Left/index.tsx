'use client'

import {
    ChevronRight, Ticket, Wallet, Star, ShoppingBag,
    MessageSquare, Heart, KeyRound,
    Calendar,
    Crown
} from "lucide-react"
import { PAGES } from '../../../../types/IPages'
import Button from "@components/Atoms/Button"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { ROUTES } from "@routes"
import { AvatarWithBorder } from "@components/Organisms/AvatarBorder"
import { Avatar } from "@components/Molecules/Avatar"
import Link from "next/link"

const menuItems = [
    { tab: "promotions", label: "Mã ưu đãi", icon: Ticket },
    { tab: "points", label: "Điểm tích lũy", icon: Wallet },
    { tab: "subscription", label: "Gói dịch vụ", icon: Crown },
    { tab: "rewards", label: "PhotoGo Rewards", icon: Star },
    { tab: "attendance", label: "Điểm danh", icon: Calendar },
    { tab: "orders", label: "Đơn hàng", icon: ShoppingBag },
    { tab: "reviews", label: "Đánh giá", icon: MessageSquare },
    { tab: "favorites", label: "Yêu thích", icon: Heart },
    { tab: "change-password", label: "Thay đổi mật khẩu", icon: KeyRound },
];


const ProfileLeft: React.FC<PAGES.ProfileLeftProps> = ({ user }) => {
    const router = useRouter();
    const pathname = usePathname();
    const currentTab = pathname?.split('/').pop() || 'profile';
    const hasPlan = !!user?.subscription?.plan?.name;
    const gradientClass = hasPlan
        ? 'bg-gradient-to-br from-[#3B82F6] via-[#38c3ec] to-[#0f70b7] light-sweep'
        : 'bg-gradient-to-br from-[#f3f4f6] via-[#e0e7ef] to-[#f3f4f6]';
    const borderColor = hasPlan ? '#3B82F6' : '#49C4D2';
    const profileRoutes: { [key: string]: string } = {
        'promotions': ROUTES.USER.PROFILE.PROMOTIONS,
        'change-password': ROUTES.USER.PROFILE.CHANGE_PASSWORD,
        'rewards': ROUTES.USER.PROFILE.REWARDS,
        'favorites': ROUTES.USER.PROFILE.FAVORITES,
        'orders': ROUTES.USER.PROFILE.ORDERS,
        'reviews': ROUTES.USER.PROFILE.REVIEWS,
        'points': ROUTES.USER.PROFILE.POINTS,
        'attendance': ROUTES.USER.PROFILE.ATTENDANCE,
        'subscription': ROUTES.USER.PROFILE.SUBSCRIPTION,
    };
    console.log(user)
    return (
        <div className="w-full mb-10 rounded-lg shadow-lg bg-white">
            {/* User Profile */}
            <div className={`relative ${gradientClass} p-5 rounded-lg shadow-inner overflow-hidden backdrop-brightness-110`}>
                <div className="absolute inset-0 bg-white/20 opacity-20 animate-[shine_2s_linear_infinite] bg-gradient-to-r from-transparent via-white to-transparent bg-[length:200%_100%]"></div>

                <svg
                    className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="white"
                        d="M0,64L48,74.7C96,85,192,107,288,112C384,117,480,107,576,122.7C672,139,768,181,864,192C960,203,1056,181,1152,176C1248,171,1344,181,1392,186.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                    />
                </svg>

                <div className="flex flex-col items-center justify-center relative z-10">
                    <AvatarWithBorder subscription={user?.subscription}>
                        <Avatar
                            src={user?.avatarUrl || 'https://res.cloudinary.com/dodtzdovx/image/upload/v1745322627/c3-1683876188-612-width800height700_b7jtxt.jpg'}
                            alt={user?.fullName || 'User'}
                            size={100}
                        />
                    </AvatarWithBorder>

                    <h2 className="mt-3 text-xl font-bold">{user?.fullName || 'Unknown User'}</h2>

                    <Button
                        className={`my-2 flex items-center text-sm line-clamp-1 opacity-90 bg-none bd-none shadow-none hover:bg-none ${currentTab === "profile" ? "text-dark bg-white p-1" : ""}`}
                        onClick={() => router.push('/profile')}
                    >
                        Cập nhật thông tin cá nhân <ChevronRight size={16} />
                    </Button>

                    <div
                        className={`w-28 h-7 my-2 inline-flex items-center justify-center border rounded-full overflow-hidden
                            ${!user?.subscription ? 'bg-yellow-50 border-yellow-400 animate-pulse shadow-lg' : 'bg-white'}`}
                        style={{ borderColor: !user?.subscription ? '#facc15' : borderColor }}
                    >
                        <div className="relative text-white mx-auto my-auto text-sm font-bold border-r-0 w-full text-center">
                            <div
                                className={`text-sm font-bold w-full text-center ${!user?.subscription ? 'text-yellow-700' : ''}`}
                                style={{ color: !user?.subscription ? undefined : borderColor }}
                            >
                                {user?.subscription ? (
                                    user?.subscription?.plan?.name
                                ) : (
                                    <Link
                                        href={ROUTES.PUBLIC.SUBSCRIPTION.MEMBERSHIP}
                                        className="font-bold underline"
                                        style={{ textShadow: '0 0 8px #facc15, 0 0 2px #fff' }}
                                    >
                                        Đăng ký ngay
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
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
                        >                            <Button
                            onClick={() => {
                                const route = profileRoutes[tab];
                                if (route) {
                                    router.push(route);
                                }
                            }}
                            className={`bg-none shadow-none hover:bg-none ${currentTab === tab
                                ? "text-primary font-medium"
                                : "text-gray-700 hover:text-primary"
                                }`}
                            variant="ghost"
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

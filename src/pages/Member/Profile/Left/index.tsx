// src/pages/Member/Profile/Left/index.tsx
'use client'
import { Card, CardContent } from "@components/Atoms/Card"
import { Avatar } from "@components/Molecules/Avatar"
import { ChevronRight, Ticket, Wallet, Star, ShoppingBag, MessageSquare, Heart, LogOut, CreditCard } from "lucide-react"
import { PAGES } from '../../../../types/IPages'
import Button from "@components/Atoms/Button"

const ProfileLeft: React.FC<PAGES.ProfileLeftProps> = ({ user, activeTab, setActiveTab }) => {

    return (
        <div className="w-full mb-10 rounded-lg shadow-lg bg-white">
            {/* User Profile Card */}
            <div className="bg-gradient-to-b from-orange-300 to-yellow-50 p-5 text-white rounded-lg">
                <div className="flex flex-col items-center justify-center">
                    <Avatar className="w-24 h-24 rounded-full" src={user?.avatarUrl || '/default-avatar.png'} alt={user?.fullName || 'User'} />
                    <h2 className="mt-3 text-xl font-bold">{user?.fullName || 'Unknown User'}</h2>
                    <Button className="my-2 flex items-center text-sm line-clamp-1 opacity-90 bg-none bd-none shadow-none hover:bg-none" onClick={() => setActiveTab("profile")}>
                        Cập nhật thông tin cá nhân <ChevronRight size={16} />
                    </Button>

                    <Card className="w-full bg-white text-gray-800 rounded-lg">
                        <CardContent className="flex items-center justify-center flex-col">
                            <div className="w-28 h-7 my-2 inline-flex items-stretch border border-[#49C4D2] rounded-full overflow-hidden">
                                <div className="relative bg-[#49C4D2] text-white px-4 py-1 text-sm font-bold border-r-0">
                                    Lv.1
                                    <div
                                        className="absolute top-0 right-[-1px] h-full w-2 bg-white"
                                        style={{ clipPath: 'polygon(0% 0, 100% 0, 100% 100%)' }}
                                    />
                                </div>

                                <div className="text-[#49C4D2] px-4 py-1 text-sm font-bold bg-white">
                                    Bạc
                                </div>
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
                <ul className="space-y-4">
                    <li>
                        <Button
                            onClick={() => setActiveTab("promotions")}
                            className={`flex items-center justify-between w-full text-left bg-none shadow-none hover:bg-none ${activeTab === "promotions" ? "text-blue-500 font-medium" : "text-gray-700 hover:text-blue-500"}`}
                        >
                            <div className="flex items-center">
                                <Ticket className="w-5 h-5 mr-3" />
                                <span>Mã ưu đãi</span>
                            </div>
                            <span className="ml-auto">Xem</span>
                        </Button>
                    </li>
                    <li>
                        <Button
                            onClick={() => setActiveTab("points")}
                            className={`flex items-center justify-between w-full text-left bg-none shadow-none hover:bg-none ${activeTab === "xu" ? "text-blue-500 font-medium" : "text-gray-700 hover:text-blue-500"}`}
                        >
                            <div className="flex items-center">
                                <Wallet className="w-5 h-5 mr-3" />
                                <span>Điểm tích lũy</span>
                            </div>
                            <span className="ml-auto">Xem</span>
                        </Button>
                    </li>
                    <li>
                        <Button
                            onClick={() => setActiveTab("rewards")}
                            className={`bg-none shadow-none hover:bg-none ${activeTab === "rewards" ? "text-orange-500 font-medium" : "text-gray-700 hover:text-blue-500"}`}
                        >
                            <div className="flex items-center">
                                <Star className={`w-5 h-5 mr-3 ${activeTab === "rewards" ? "fill-orange-500" : ""}`} />
                                <span>PhotoGo Rewards</span>
                            </div>

                        </Button>
                    </li>
                    <li className="pt-3 border-t">
                        <Button
                            onClick={() => setActiveTab("orders")}
                            className={`bg-none shadow-none hover:bg-none ${activeTab === "orders" ? "text-blue-500 font-medium" : "text-gray-700 hover:text-blue-500"}`}
                        >
                            <div className="flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-3" />
                                <span>Đơn hàng</span>
                            </div>

                        </Button>
                    </li>
                    <li>
                        <Button
                            onClick={() => setActiveTab("reviews")}
                            className={`bg-none shadow-none hover:bg-none ${activeTab === "reviews" ? "text-blue-500 font-medium" : "text-gray-700 hover:text-blue-500"}`}
                        >
                            <div className="flex items-center">
                                <MessageSquare className="w-5 h-5 mr-3" />
                                <span>Đánh giá</span>
                            </div>

                        </Button>
                    </li>
                    <li>
                        <Button
                            onClick={() => setActiveTab("payment")}
                            className={`bg-none shadow-none hover:bg-none ${activeTab === "payment" ? "text-blue-500 font-medium" : "text-gray-700 hover:text-blue-500"}`}
                        >
                            <div className="flex items-center">
                                <CreditCard className="w-5 h-5 mr-3" />
                                <span>Quản lý phương thức thanh toán</span>
                            </div>

                        </Button>
                    </li>

                    <li>
                        <Button
                            onClick={() => setActiveTab("favorites")}
                            className={`bg-none shadow-none hover:bg-none ${activeTab === "favorites" ? "text-blue-500 font-medium" : "text-gray-700 hover:text-blue-500"}`}
                        >

                            <div className="flex items-center">
                                <Heart className="w-5 h-5 mr-3" />
                                <span>Yêu thích</span>
                            </div>

                        </Button>
                    </li>
                    <li>
                        <Button
                            onClick={() => setActiveTab("login")}
                            className={`bg-none shadow-none hover:bg-none ${activeTab === "login" ? "text-blue-500 font-medium" : "text-gray-700 hover:text-blue-500"}`}
                        >
                            <div className="flex items-center">
                                <LogOut className="w-5 h-5 mr-3" />
                                <span>Quản lý đăng nhập</span>
                            </div>

                        </Button>
                    </li>

                </ul>
            </nav>
        </div>
    )
}

export default ProfileLeft;
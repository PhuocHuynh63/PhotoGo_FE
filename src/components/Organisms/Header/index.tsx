import { Avatar } from "@components/Molecules/Avatar"
import { ROUTES } from "@routes"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/Molecules/DropdownMenu";
import LucideIcon from "@components/Atoms/LucideIcon"
import Button from "@components/Atoms/Button"


export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md p-2 px-4 md:px-8 w-full rounded-md sticky top-0 z-50">
            <div className="flex justify-between items-center">
                <Link href={ROUTES.PUBLIC.HOME}>
                    <Image src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg" alt="logo" width={60} height={60} style={{ width: 'auto', height: 'auto' }} priority />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-12 font-medium text-lg">
                    <Link href={ROUTES.PUBLIC.HOME}>Trang chủ</Link>
                    <Link href={ROUTES.PUBLIC.STUDIO}>Studio</Link>
                    <Link href={ROUTES.PUBLIC.FREELANCER}>Freelancer</Link>
                    <Link href={ROUTES.PUBLIC.ABOUT}>Về chúng tôi</Link>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden p-2 rounded-md hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    <div className="hidden md:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar
                                    src="https://thanhnien.mediacdn.vn/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg"
                                    alt="User avatar"
                                    size={50}
                                    className="cursor-pointer"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href={"/hello"}>
                                    <DropdownMenuItem icon="UserCircle">
                                        <span>Thông tin cá nhân</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href={"/ROUTES.PRIVATE.SETTINGS"}>
                                    <DropdownMenuItem icon="Settings">
                                        <span>Cài đặt</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href={"/ROUTES.PRIVATE.NOTIFICATIONS"}>
                                    <DropdownMenuItem icon="Bell">
                                        <span>Thông báo</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href={"/ROUTES.PRIVATE.MESSAGES"}>
                                    <DropdownMenuItem icon="MessageSquare">
                                        <span>Tin nhắn</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href={"/ROUTES.PRIVATE.HELP"}>
                                    <DropdownMenuItem icon="HelpCircle">
                                        <span>Trợ giúp</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <Link href={"/ROUTES.PUBLIC.LOGIN"}>
                                    <DropdownMenuItem icon="LogOut">
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
                <div className="px-4 py-2 mt-2 border-b">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar
                            size={40}
                            src="https://thanhnien.mediacdn.vn/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg"
                            fallback="User" />
                        <div className="flex flex-col">
                            <span className="font-medium">Tên người dùng</span>
                            <span className="text-sm text-gray-500">email@example.com</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 py-4">
                    <Link
                        href={ROUTES.PUBLIC.HOME}
                        className="px-4 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Trang chủ
                    </Link>
                    <Link
                        href={ROUTES.PUBLIC.STUDIO}
                        className="px-4 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Studio
                    </Link>
                    <Link
                        href={ROUTES.PUBLIC.FREELANCER}
                        className="px-4 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Freelancer
                    </Link>
                    <Link
                        href={ROUTES.PUBLIC.ABOUT}
                        className="px-4 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Về chúng tôi
                    </Link>

                    <div className="border-t pt-4">
                        <Link
                            href="/profile"
                            className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <LucideIcon name="User" iconSize={18} />
                            Hồ sơ của tôi
                        </Link>
                        <Link
                            href="/settings"
                            className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <LucideIcon name="Settings" iconSize={18} />
                            Cài đặt
                        </Link>
                        <Button icon="LogOut" iconSize={18} className="w-full" onClick={() => {

                            setIsMobileMenuOpen(false);
                        }}>
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

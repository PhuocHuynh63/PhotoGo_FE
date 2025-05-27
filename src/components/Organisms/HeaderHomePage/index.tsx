"use client";

import { Avatar } from "@components/Molecules/Avatar";
import { ROUTES } from "@routes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@components/Atoms/ui/dropdown-menu";
import LucideIcon from "@components/Atoms/LucideIcon";
import Button from "@components/Atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
import LocationButton from "../LocationButton/LocationButton";
import NavLink from "@utils/helpers/NavLink";
import "./index.scss";
import { signOut } from "next-auth/react";
import { PAGES } from "../../../types/IPages";
import ShoppingCartModal from "../ShoppingCartModal/ShoppingCartModal";
import { usePathname } from "next/navigation";

//#region Helpers
const timeAgo = (date: string) => {
    const seconds = Math.floor(
        (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} năm trước`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} tháng trước`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} ngày trước`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} giờ trước`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} phút trước`;
    return `${seconds} giây trước`;
};
//#endregion

export default function HeaderHomePage({ user }: PAGES.IHeader) {
    //#region States
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<ICOMPONENTS.Notification[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpenCart, setIsOpenCart] = useState(false);
    const pathname = usePathname();
    //#endregion

    //#region Mock Data
    const cart: ICOMPONENTS.CartItem[] = [
        {
            id: 1,
            name: "string",
            price: 11111,
            img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg",
            vendor_id: 2,
            duration: 120,
            booked_date: new Date("2023-01-01"),
        },
        {
            id: 2,
            name: "string",
            price: 11111,
            img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg",
            vendor_id: 1,
            duration: 120,
            booked_date: new Date("2023-01-01"),
        },
        {
            id: 3,
            name: "string",
            price: 11111,
            img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg",
            vendor_id: 2,
            duration: 120,
            booked_date: new Date("2023-01-01"),
        },
        {
            id: 4,
            name: "string",
            price: 11111,
            img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg",
            vendor_id: 1,
            duration: 120,
            booked_date: new Date("2023-01-01"),
        },
        {
            id: 5,
            name: "string",
            price: 11111,
            img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg",
            vendor_id: 2,
            duration: 120,
            booked_date: new Date("2023-01-01"),
        },
        {
            id: 6,
            name: "string",
            price: 11111,
            img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg",
            vendor_id: 3,
            duration: 120,
            booked_date: new Date("2023-01-01"),
        },
    ];
    //#endregion

    //#region Effects
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 120);
            });
        };
        window.addEventListener("scroll", handleScroll);

        if (isOpenCart) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.body.style.overflow = "auto";
        };
    }, [isOpenCart]);
    //#endregion

    //#region Memoized Values
    const unreadNotifications = useMemo(() => {
        return notifications.filter((notification) => !notification.read);
    }, [notifications]);
    //#endregion

    //#region Event Handlers
    const handleOpenNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const handleOpenCart = () => {
        setIsOpenCart(!isOpenCart);
    };
    //#endregion

    //#region Render Methods
    const renderDesktopNavigation = () => (
        <div className="hidden md:flex gap-12 font-medium text-lg ml-5">
            <NavLink className={`nav-link ${isScrolled ? "scrolled" : ""}`} href={ROUTES.PUBLIC.HOME}>
                <span className={isScrolled ? "text-black" : "text-white"}>Trang chủ</span>
            </NavLink>
            <NavLink className={`nav-link ${isScrolled ? "scrolled" : ""}`} href={ROUTES.PUBLIC.SEARCH_VENDORS}>
                <span className={isScrolled ? "text-black" : "text-white"}>Nhà cung cấp</span>
            </NavLink>
            <NavLink className={`nav-link ${isScrolled ? "scrolled" : ""}`} href={ROUTES.PUBLIC.SEARCH_PACKAGES}>
                <span className={isScrolled ? "text-black" : "text-white"}>Gói dịch vụ</span>
            </NavLink>
            <NavLink className={`nav-link ${isScrolled ? "scrolled" : ""}`} href={ROUTES.PUBLIC.ABOUT}>
                <span className={isScrolled ? "text-black" : "text-white"}>Về chúng tôi</span>
            </NavLink>
        </div>
    );

    const renderUserMenu = () => (
        <div className="flex items-center justify-center gap-5 relative">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-center mt-2">
                    <LocationButton
                        className="hover:bg-white/10 p-1 rounded-md"
                        isScrolled={isScrolled}
                        isLoaded={isLoaded}
                    />
                </div>
            </motion.div>

            {/* Cart Button */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                <div
                    onClick={handleOpenCart}
                    className="cursor-pointer relative mt-2 p-1 rounded-md hover:bg-[#c9c9ce21]"
                >
                    <LucideIcon
                        name="ShoppingCart"
                        iconSize={26}
                        iconColor={isScrolled ? "black" : "white"}
                    />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cart?.length || 0}
                    </span>
                </div>
            </motion.div>

            <ShoppingCartModal isOpen={isOpenCart} onClose={() => setIsOpenCart(false)} cart={cart || []} />

            {/* Notification Button */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            onClick={handleOpenNotification}
                            className="hover:bg-[#c9c9ce21] cursor-pointer relative mt-2 p-1 rounded-md"
                        >
                            <LucideIcon
                                name="Bell"
                                iconSize={26}
                                iconColor={isScrolled ? "black" : "white"}
                            />
                            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadNotifications.length}
                            </span>
                        </div>
                    </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                    <DropdownMenuLabel className="text-xl font-bold flex justify-between items-center">
                        Thông báo
                        <Button
                            className="text-sm whitespace-pre text-blue-500 bg-none shadow-none hover:bg-gray-200"
                            onClick={() => {
                                setNotifications(
                                    notifications.map((notification) => ({
                                        ...notification,
                                        read: true,
                                    }))
                                );
                            }}
                        >
                            Đánh dấu đã đọc
                        </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setNotifications((prevNotifications) =>
                                        prevNotifications.map((n) =>
                                            n.id === notification.id
                                                ? { ...n, read: true }
                                                : n
                                        )
                                    );
                                }}
                            >
                                <div className="flex flex-col gap-2 w-full">
                                    <div className="flex w-full justify-between items-center">
                                        <p className="text-sm font-medium">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {timeAgo(notification.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex w-full justify-between">
                                        <p className="text-xs text-gray-500 whitespace-normal break-words">
                                            {notification.description}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {!notification.read && (
                                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled>
                            <p className="text-sm text-gray-500">
                                Không có thông báo mới.
                            </p>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Avatar
                            className="cursor-pointer"
                            src={user?.avatarUrl || "/default-avatar.png"}
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            alt={user?.fullName || "User"}
                        />
                    </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={ROUTES.USER.PROFILE}>
                        <DropdownMenuItem icon="UserCircle">
                            <span>Thông tin cá nhân</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href={''}>
                        <DropdownMenuItem icon="Settings">
                            <span>Cài đặt</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href={'/chat'}>
                        <DropdownMenuItem icon="MessageSquare">
                            <span>Tin nhắn</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href={''}>
                        <DropdownMenuItem icon="HelpCircle">
                            <span>Trợ giúp</span>
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        icon="LogOut"
                        onClick={() => {
                            console.log('>>>>>>>>>>>>>>>>', process.env.NEXT_PUBLIC_BASE_URL);
                            signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })
                        }}
                    >
                        <span>Đăng xuất</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    const renderMobileMenu = () => (
        <AnimatePresence mode="wait">
            {isMobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <motion.div
                        key="menu"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                            mass: 1
                        }}
                        className="md:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-xl z-50 overflow-y-auto"
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-4 border-b flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {user ? (
                                        <>
                                            <Avatar
                                                src={user?.avatarUrl || "/default-avatar.png"}
                                                alt={user?.fullName || "User"}
                                                className="w-10 h-10"
                                            />
                                            <div>
                                                <p className="font-medium">{user?.fullName}</p>
                                                <p className="text-sm text-gray-500">{user?.email}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Link href={ROUTES.AUTH.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button className="bg-primary text-white">Đăng ký</Button>
                                            </Link>
                                            <Link href={ROUTES.AUTH.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button className="bg-primary text-white">Đăng nhập</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <LucideIcon name="X" iconSize={24} />
                                </button>
                            </div>

                            {/* Quick Actions */}
                            {user && (
                                <div className="p-4 border-b">
                                    <div className="grid grid-cols-4 gap-4">
                                        <Link href={ROUTES.USER.PROFILE} onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                <LucideIcon name="UserCircle" iconSize={24} />
                                            </div>
                                            <span className="text-xs">Tài khoản</span>
                                        </Link>
                                        <Link href={'/chat'} onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                <LucideIcon name="MessageSquare" iconSize={24} />
                                            </div>
                                            <span className="text-xs">Tin nhắn</span>
                                        </Link>
                                        <div onClick={handleOpenCart} className="flex flex-col items-center gap-1 cursor-pointer">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center relative">
                                                <LucideIcon name="ShoppingCart" iconSize={24} />
                                                {cart.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                        {cart.length}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs">Giỏ hàng</span>
                                        </div>
                                        <div onClick={handleOpenNotification} className="flex flex-col items-center gap-1 cursor-pointer">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center relative">
                                                <LucideIcon name="Bell" iconSize={24} />
                                                {unreadNotifications.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                        {unreadNotifications.length}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs">Thông báo</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <div className="flex-1 p-4">
                                <div className="space-y-1">
                                    <Link href={ROUTES.PUBLIC.HOME} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className={`flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors ${pathname === ROUTES.PUBLIC.HOME || pathname === "/" ? "bg-primary/10 text-primary" : ""}`}>
                                            <LucideIcon name="Home" iconSize={20} />
                                            <span>Trang chủ</span>
                                        </div>
                                    </Link>
                                    <Link href={ROUTES.PUBLIC.SEARCH_VENDORS} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                            <LucideIcon name="Store" iconSize={20} />
                                            <span>Nhà cung cấp</span>
                                        </div>
                                    </Link>
                                    <Link href={ROUTES.PUBLIC.SEARCH_PACKAGES} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                            <LucideIcon name="Package" iconSize={20} />
                                            <span>Gói dịch vụ</span>
                                        </div>
                                    </Link>
                                    <Link href={ROUTES.PUBLIC.ABOUT} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                            <LucideIcon name="Info" iconSize={20} />
                                            <span>Về chúng tôi</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Footer */}
                            {user && (
                                <div className="p-4 border-t">
                                    <div className="space-y-1">
                                        <Link href={''} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                                <LucideIcon name="Settings" iconSize={20} />
                                                <span>Cài đặt</span>
                                            </div>
                                        </Link>
                                        <Link href={''} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                                <LucideIcon name="HelpCircle" iconSize={20} />
                                                <span>Trợ giúp</span>
                                            </div>
                                        </Link>
                                        <div
                                            onClick={() => {
                                                console.log('>>>>>>>>>>>>>>>>', process.env.NEXT_PUBLIC_BASE_URL);
                                                signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL });
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-red-500"
                                        >
                                            <LucideIcon name="LogOut" iconSize={20} />
                                            <span>Đăng xuất</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
    //#endregion

    return (
        <header
            className={`header p-4 px-4 md:px-8 w-full rounded-md fixed top-0 z-40 transition-all duration-300 ease-in-out ${isScrolled ? "bg-[rgba(177,177,177,0.65)] shadow-xl" : "bg-transparent"}`}
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1 }}
            >
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div>
                        <Link href={ROUTES.PUBLIC.HOME}>
                            <Image
                                src={
                                    isScrolled
                                        ? "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg"
                                        : "https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_orange_jslflw.svg"
                                }
                                alt="logo"
                                width={60}
                                height={60}
                                style={{ width: "auto", height: "auto" }}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {renderDesktopNavigation()}

                    {/* Right Section */}
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
                            {user ? renderUserMenu() : (
                                <div className="flex gap-2">
                                    <Link href={ROUTES.AUTH.REGISTER}>
                                        <Button className="bg-primary text-white">Đăng ký</Button>
                                    </Link>
                                    <Link href={ROUTES.AUTH.LOGIN}>
                                        <Button className="bg-primary text-white">Đăng nhập</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            {renderMobileMenu()}
        </header>
    );
}
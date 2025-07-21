"use client";

import { Avatar } from "@components/Molecules/Avatar";
import { ROUTES } from "@routes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { useCart, useFetchCartByUserId } from "@stores/cart/selectors";

import { AvatarWithBorder } from "../AvatarBorder";
import { Rank } from "../AvatarBorder/rankStyles";
import { ROLE } from "@constants/common";
import NotificationDropdown from "../NotificationDropdown";
import MobileNotificationButton from "../MobileNotificationButton";

export default function Header({ user, servicePackages }: PAGES.IHeader) {
    const router = useRouter();
    const cartState = useCart()
    const fetchCartByUserId = useFetchCartByUserId();
    //#region States
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isOpenCart, setIsOpenCart] = useState(false);
    const pathname = usePathname();
    //#endregion

    //#region Mock Data
    const cartItems = cartState?.data || [];
    //#endregion

    //#region Effects
    useEffect(() => {
        setIsLoaded(true);
    }, [pathname]);

    useEffect(() => {
        if (user?.id) {
            fetchCartByUserId(user.id);
        }
    }, [user?.id, fetchCartByUserId]);

    //#endregion



    //#region Event Handlers
    const handleOpenNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const handleOpenCart = () => {
        setIsOpenCart(!isOpenCart);
    };
    //#region Render Methods
    const renderDesktopNavigation = () => (
        <div className="hidden md:flex gap-12 font-medium text-lg ml-5">
            <NavLink
                className={`nav-link ${pathname === ROUTES.PUBLIC.HOME || pathname === "/" ? "active" : ""}`}
                href={ROUTES.PUBLIC.HOME}
            >
                <span className={"text-black"}>Trang chủ</span>
            </NavLink>
            <NavLink
                className={`nav-link ${pathname === ROUTES.PUBLIC.SEARCH_VENDORS ? "active" : ""}`}
                href={ROUTES.PUBLIC.SEARCH_VENDORS}
            >
                <span className={"text-black"}>Nhà cung cấp</span>
            </NavLink>
            <NavLink
                className={`nav-link ${pathname === ROUTES.PUBLIC.SEARCH_PACKAGES ? "active" : ""}`}
                href={ROUTES.PUBLIC.SEARCH_PACKAGES}
            >
                <span className={"text-black"}>Gói dịch vụ</span>
            </NavLink>
            <NavLink
                className={`nav-link ${pathname === ROUTES.PUBLIC.ABOUT ? "active" : ""}`}
                href={ROUTES.PUBLIC.ABOUT}
            >
                <span className={"text-black"}>Về chúng tôi</span>
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
                className="-mr-3"
            >
                <div className="flex items-center justify-center mt-2">
                    <LocationButton
                        className="hover:bg-white/10 p-1 rounded-md text-dark"
                        isLoaded={isLoaded}
                    />
                </div>
            </motion.div>
            <button className="cursor-pointer relative px-8 py-2 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 animate-gradient" onClick={() => router.push(ROUTES.PUBLIC.SUBSCRIPTION.MEMBERSHIP)}>
                <div
                    className="absolute inset-0 animate-pulse"
                    style={{
                        background:
                            "linear-gradient(270deg, #8B5CF6, #A855F7, #EC4899, #F97316, #EAB308, #84CC16, #10B981, #06B6D4)",
                        backgroundSize: "400% 400%",
                        animation: "gradient 3s ease infinite",
                    }}
                />
                <span className="relative z-10">🔥 Ưu đãi hội viên</span>
            </button>
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
                        iconColor={"black"}
                    />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems?.length || 0}
                    </span>
                </div>
            </motion.div>

            <ShoppingCartModal isOpen={isOpenCart} onClose={() => setIsOpenCart(false)} servicePackages={servicePackages} />

            <NotificationDropdown
                isNotificationOpen={isNotificationOpen}
                setIsNotificationOpen={setIsNotificationOpen}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AvatarWithBorder
                            rank={user?.rank as Rank}
                        >
                            <Avatar
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                src={user?.avatarUrl || "/default-avatar.png"}
                                alt={user?.fullName || "User"}
                                className="cursor-pointer"
                            />
                        </AvatarWithBorder>
                    </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={
                        user?.role?.name === ROLE.CUSTOMER
                            ? ROUTES.USER.PROFILE.INFO
                            : user?.role?.name === ROLE.VENDOR_OWNER
                                ? ROUTES.VENDOR.PROFILE
                                : ROUTES.USER.PROFILE.INFO
                    }>
                        <DropdownMenuItem icon="UserCircle">
                            <span>Thông tin cá nhân</span>
                        </DropdownMenuItem>
                    </Link>
                    {/* <Link href={''}>
                        <DropdownMenuItem icon="Settings">
                            <span>Cài đặt</span>
                        </DropdownMenuItem>
                    </Link> */}
                    <Link href={'/chat'}>
                        <DropdownMenuItem icon="MessageSquare">
                            <span>Tin nhắn</span>
                        </DropdownMenuItem>
                    </Link>
                    {/* <Link href={''}>
                        <DropdownMenuItem icon="HelpCircle">
                            <span>Trợ giúp</span>
                        </DropdownMenuItem>
                    </Link> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        icon="LogOut"
                        onClick={() => handleLogout()}
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
                                                alt={user?.fullName || "User"}
                                                src={user?.avatarUrl || "/default-avatar.png"}
                                                className="w-10 h-10"
                                            />
                                            <div>
                                                <p className="font-medium">{user?.fullName}</p>
                                                <p className="text-sm text-gray-500">{user?.email}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex gap-2">
                                            {/* <Link href={ROUTES.AUTH.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button className="bg-primary text-white">Đăng ký</Button>
                                            </Link> */}
                                            <Link href={ROUTES.AUTH.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button className="bg-primary text-white relative group overflow-hidden">
                                                    <span className="relative z-10">Đăng nhập</span>
                                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                                                </Button>
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
                                        <Link
                                            href={ROUTES.USER.PROFILE.INFO}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex flex-col items-center gap-1 ${pathname === ROUTES.USER.PROFILE.INFO ? "text-primary" : ""}`}
                                        >
                                            <div className={`w-12 h-12 rounded-full ${pathname === ROUTES.USER.PROFILE.INFO ? "bg-primary/10" : "bg-gray-100"} flex items-center justify-center`}>
                                                <LucideIcon name="UserCircle" iconSize={24} />
                                            </div>
                                            <span className="text-xs">Tài khoản</span>
                                        </Link>
                                        <Link
                                            href={'/chat'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex flex-col items-center gap-1 ${pathname === '/chat' ? "text-primary" : ""}`}
                                        >
                                            <div className={`w-12 h-12 rounded-full ${pathname === '/chat' ? "bg-primary/10" : "bg-gray-100"} flex items-center justify-center`}>
                                                <LucideIcon name="MessageSquare" iconSize={24} />
                                            </div>
                                            <span className="text-xs">Tin nhắn</span>
                                        </Link>
                                        <div
                                            onClick={handleOpenCart}
                                            className={`flex flex-col items-center gap-1 cursor-pointer ${isOpenCart ? "text-primary" : ""}`}
                                        >
                                            <div className={`w-12 h-12 rounded-full ${isOpenCart ? "bg-primary/10" : "bg-gray-100"} flex items-center justify-center relative`}>
                                                <LucideIcon name="ShoppingCart" iconSize={24} />
                                                {cartItems?.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                        {cartItems?.length}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs">Giỏ hàng</span>
                                        </div>
                                        <MobileNotificationButton
                                            isNotificationOpen={isNotificationOpen}
                                            handleOpenNotification={handleOpenNotification}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <div className="flex-1 p-4">
                                <div className="space-y-1">
                                    <Link href={ROUTES.PUBLIC.HOME} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className={`flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors ${pathname === ROUTES.PUBLIC.HOME ? "bg-primary/10 text-primary" : ""}`}>
                                            <LucideIcon name="Home" iconSize={20} />
                                            <span>Trang chủ</span>
                                        </div>
                                    </Link>
                                    <Link href={ROUTES.PUBLIC.SEARCH_VENDORS} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className={`flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors ${pathname === ROUTES.PUBLIC.SEARCH_VENDORS ? "bg-primary/10 text-primary" : ""}`}>
                                            <LucideIcon name="Store" iconSize={20} />
                                            <span>Nhà cung cấp</span>
                                        </div>
                                    </Link>
                                    <Link href={ROUTES.PUBLIC.SEARCH_PACKAGES} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className={`flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors ${pathname === ROUTES.PUBLIC.SEARCH_PACKAGES ? "bg-primary/10 text-primary" : ""}`}>
                                            <LucideIcon name="Package" iconSize={20} />
                                            <span>Gói dịch vụ</span>
                                        </div>
                                    </Link>
                                    <Link href={ROUTES.PUBLIC.ABOUT} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className={`flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors ${pathname === ROUTES.PUBLIC.ABOUT ? "bg-primary/10 text-primary" : ""}`}>
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
                                            <div className={`flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors ${pathname === '/settings' ? "bg-primary/10 text-primary" : ""}`}>
                                                <LucideIcon name="Settings" iconSize={20} />
                                                <span>Cài đặt</span>
                                            </div>
                                        </Link>
                                        <Link href={''} onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors ${pathname === '/help' ? "bg-primary/10 text-primary" : ""}`}>
                                                <LucideIcon name="HelpCircle" iconSize={20} />
                                                <span>Trợ giúp</span>
                                            </div>
                                        </Link>
                                        <div
                                            onClick={() => handleLogout()}
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

    //#region Handle logout
    const handleLogout = () => {
        signOut({ callbackUrl: process.env.NEXTAUTH_URL });
    };
    //#endregion

    return (
        <header
            className={`header p-4 px-4 md:px-8 w-full rounded-b-sm sticky top-0 z-40 transition-all duration-300 ease-in-out  bg-white shadow-xl`}
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
                                src={"https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg"}
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
                                    {/* <Link href={ROUTES.AUTH.REGISTER}>
                                        <Button className="bg-primary text-white">Đăng ký</Button>
                                    </Link> */}
                                    <Link href={ROUTES.AUTH.LOGIN}>
                                        <Button className="bg-primary text-white relative group overflow-hidden">
                                            <span className="relative z-10">Đăng nhập</span>
                                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                                        </Button>
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
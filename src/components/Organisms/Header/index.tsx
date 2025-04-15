'use client'
import { Avatar } from "@components/Molecules/Avatar"
import { ROUTES } from "@routes"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
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
import { motion } from "framer-motion"
import ShoppingCartModal from "../ShoppingCartModal/ShoppingCartModal"
import LocationButton from "../LocationButton/LocationButton"
import NavLink from "@utils/helpers/NavLink"
import './index.scss'

const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
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

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<ICOMPONENTS.User | null>(null);
    const [notifications, setNotifications] = useState<ICOMPONENTS.Notification[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpenCart, setIsOpenCart] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
        const userFromLocalStorage = localStorage.getItem("user");
        if (userFromLocalStorage) {
            setUser(JSON.parse(userFromLocalStorage));
        } else {
            setUser({
                id: 1,
                name: "Nguyễn Văn A",
                email: "nguyenvana@gmail.com",
                avatar: "https://static-images.vnncdn.net/vps_images_publish/000001/000003/2025/1/20/ngan-ngam-thay-ca-si-jack-j97-72911.jpg?width=0&s=OQaz1tZ-7uFLA8UTXffWFQ",
                rank: "gold",
                notifications: [
                    { id: 1, title: "Thông báo 1", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.", read: false, createdAt: "2025-03-05T10:46:58.557+00:00" },
                    { id: 2, title: "Thông báo 2", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.", read: false, createdAt: "2025-04-01T10:46:58.557+00:00" },
                    { id: 3, title: "Thông báo 3", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.", read: false, createdAt: "2025-04-13T10:46:58.557+00:00" },
                    { id: 4, title: "Thông báo 4", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.", read: true, createdAt: "2025-04-13T16:02:58.557+00:00" },
                ],
                cart: [
                    { id: 1, name: "Sản phẩm 1", img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744562854/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg", price: 100000, vendor_id: 1, duration: 30, booked_date: new Date() },
                    { id: 2, name: "Sản phẩm 2", img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744562854/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg", price: 100000, vendor_id: 2, duration: 60, booked_date: new Date() },
                    { id: 3, name: "Sản phẩm 3", img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744562854/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg", price: 100000, vendor_id: 3, duration: 120, booked_date: new Date() },
                    { id: 4, name: "Sản phẩm 4", img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744562854/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg", price: 100000, vendor_id: 4, duration: 90, booked_date: new Date() },
                    { id: 5, name: "Sản phẩm 5", img: "https://res.cloudinary.com/dodtzdovx/image/upload/v1744562854/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg", price: 200000, vendor_id: 4, duration: 120, booked_date: new Date() },
                ]
            });
        }
        setIsLoaded(true)
        // Kiểm tra vị trí cuộn ngay khi component được khởi tạo
        setIsScrolled(window.scrollY > 120);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    }

    const unreadNotifications = useMemo(() => {
        return notifications.filter(notification => !notification.read)
    }, [notifications]);
    const handleOpenNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    }
    useEffect(() => {
        setNotifications(user?.notifications || []);
    }, [user]);

    const handlOpenCart = () => {
        setIsOpenCart(!isOpenCart);
    }

    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 120);
            });
        };
        window.addEventListener('scroll', handleScroll);

        if (isOpenCart) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'auto';
        };
    }, [isOpenCart]);

    // Kiểm tra vị trí cuộn ngay khi component được khởi tạo
    // useEffect(() => {
    //     setIsScrolled(window.scrollY > 120);
    // }, []);

    return (
        <header className={`header p-4 px-4 md:px-8 w-full rounded-md fixed top-0 z-40 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-[rgba(177,177,177,0.51)] shadow-md ' : 'bg-transparent'}`}>
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
                            <Image src={`${isScrolled ? 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg' : 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_orange_jslflw.svg'}`} alt="logo" width={60} height={60} style={{ width: 'auto', height: 'auto' }} priority />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className={`hidden md:flex gap-12 font-medium text-lg ml-5 ${isScrolled ? 'text-black' : 'text-white'}`}>
                        <NavLink className="nav-link" href={ROUTES.PUBLIC.HOME}><span>Trang chủ</span></NavLink>
                        <NavLink className="nav-link" href={ROUTES.PUBLIC.STUDIO}><span>Studio</span></NavLink>
                        <NavLink className="nav-link" href={ROUTES.PUBLIC.FREELANCER}><span>Freelancer</span></NavLink>
                        <NavLink className="nav-link" href={ROUTES.PUBLIC.ABOUT}><span>Về chúng tôi</span></NavLink>
                    </div>

                    {/* right */}
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

                            {user ? (
                                <div className="flex items-center justify-center gap-5 relative">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center justify-center mt-2">
                                            <LocationButton className="hover:bg-white/10 p-1 rounded-md" isScrolled={isScrolled} isLoaded={isLoaded} />
                                        </div>
                                    </motion.div>


                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div
                                            onClick={handlOpenCart}
                                            className="cursor-pointer relative mt-2 hover:bg-[var(--bg-primary)] p-1 rounded-md">
                                            <LucideIcon name="ShoppingCart" iconSize={26} iconColor={isScrolled ? 'black' : 'white'} />
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {user?.cart.length}
                                            </span>
                                        </div>

                                    </motion.div>

                                    <ShoppingCartModal isOpen={isOpenCart} onClose={() => setIsOpenCart(false)} cart={user?.cart || []} />

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div onClick={handleOpenNotification} className="cursor-pointer relative mt-2 hover:bg-[var(--bg-primary)] p-1 rounded-md">
                                                    <LucideIcon name="Bell" iconSize={26} iconColor={isScrolled ? 'black' : 'white'} />
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
                                                        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
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
                                                            setNotifications(prevNotifications =>
                                                                prevNotifications.map(n =>
                                                                    n.id === notification.id ? { ...n, read: true } : n
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        <div className="flex flex-col gap-2 w-full">
                                                            <div className="flex w-full justify-between items-center">
                                                                <p className="text-sm font-medium">{notification.title}</p>
                                                                <p className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</p>
                                                            </div>
                                                            <div className="flex w-full justify-between">
                                                                <p className="text-xs text-gray-500 whitespace-normal break-words">{notification.description}</p>
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
                                                    <p className="text-sm text-gray-500">Không có thông báo mới.</p>
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <DropdownMenu >
                                        <DropdownMenuTrigger asChild>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Avatar
                                                    className="cursor-pointer"
                                                    src={user.avatar}
                                                    onClick={() => {
                                                        setIsNotificationOpen(!isNotificationOpen);
                                                    }}
                                                    alt={user.name}
                                                // size={user.rank === "unranked" ? 50 : 30}
                                                // rank={user.rank as ICOMPONENTS.UserRank ? user.rank as ICOMPONENTS.UserRank : "unranked"}
                                                // showRankLabel={false}
                                                // rankSize="sm"
                                                />
                                            </motion.div>
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
                                            <DropdownMenuItem icon="LogOut" onClick={handleLogout}>
                                                <Link href={ROUTES.PUBLIC.HOME}>
                                                    <span>Đăng xuất</span>
                                                </Link>
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <div className="flex gap-2 ">
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
            {/* Mobile */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out rounded-md ${isMobileMenuOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} ${isScrolled ? '' : 'bg-[rgba(216,212,212,0.9)] '}`}
            >
                <div className="px-4 py-2 mt-2 border-b">
                    {user ? (
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar
                                size={40}
                                src={user.avatar}
                                fallback={user.name.charAt(0)} />
                            <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-sm text-gray-500">{user.email}</span>
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

                                <div className="border-t pt-4 flex flex-col gap-2">
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
                                        handleLogout()
                                        setIsMobileMenuOpen(false);
                                    }}>
                                        Đăng xuất
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center mb-4">
                            <h2 className="text-lg font-semibold mb-2">Chào mừng bạn đến với chúng tôi!</h2>
                            <p className="text-sm text-gray-600 mb-4">Vui lòng đăng nhập hoặc đăng ký để tiếp tục.</p>
                            <div className="flex justify-center gap-3 items-center">
                                <Link href={ROUTES.AUTH.REGISTER}>Đăng ký</Link>
                                <Link href={ROUTES.AUTH.LOGIN}>Đăng nhập</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

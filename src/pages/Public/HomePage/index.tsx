'use client'

import Button from "@components/Atoms/Button"
import ClearButton from "@components/Atoms/ClearButton"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import LucideIcon from "@components/Atoms/LucideIcon"
import EmblaCarousel from "@components/Organisms/AutoPlayCarousel"
import { AnimatePresence, motion } from 'framer-motion'
import AutoScrollCarousel from "@components/Organisms/AutoScrollCarousel"
import Link from 'next/link'
import BackToTop from "@components/Atoms/BackToTop"
import { PAGES } from '../../../types/IPages';
import AttendanceBoard from "../AttendanceModal"


const carouselItems: ICOMPONENTS.CarouselItem[] = [
    {
        id: 1,
        image: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
    },
    {
        id: 2,
        image: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744623477/themyvanhungcaicay.png',
    },
    {
        id: 3,
        image: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744622616/themyvacayco.jpg',
    },
    {
        id: 4,
        image: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744623544/themyvacaicay_tb7frq.jpg',
    },
    {
        id: 5,
        image: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744624604/Screenshot_2025-04-14_165634_ofatn1.png',
    },
    {
        id: 6,
        image: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744624539/themyxungtoiko_pslpth.png',
    },
];

const autoScrollItems: ICOMPONENTS.AutoScrollItem[] = [
    {
        id: 1,
        name: 'Huỳnh Minh Phước',
        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 5,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời!',
    },
    {
        id: 2,
        name: 'Huỳnh Minh Phước',
        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 3,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    },
    {
        id: 3,
        name: 'Huỳnh Minh Phước',
        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 1,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    },
    {
        id: 4,
        name: 'Huỳnh Minh Phước',
        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 2,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    },
    {
        id: 5,
        name: 'Huỳnh Minh Phước',

        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 4,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời!',
    },
    {
        id: 6,
        name: 'Huỳnh Minh Phước',
        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 5,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời!',
    },
    {
        id: 7,
        name: 'Huỳnh Minh Phước',
        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 5,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời!',
    },
    {
        id: 8,
        name: 'Huỳnh Minh Phước',
        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 5,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời!',
    },
    {
        id: 9,
        name: 'Huỳnh Minh Phước',
        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 5,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời!',
    },
    {
        id: 10,
        name: 'Huỳnh Minh Phước',
        avatar: 'https://res.cloudinary.com/dodtzdovx/image/upload/v1744637748/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg',
        star: 5,
        comment: 'Chụp ảnh cưới của tôi rất tuyệt vời!',
    },
]


const HomePage = ({ user, attendance, checkAttendance }: PAGES.IHomePage) => {
    const [scrollY, setScrollY] = useState(0)
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
    const [heroAnimation, setHeroAnimation] = useState(true)
    const [servicesAnimation, setServicesAnimation] = useState(false)
    const [howItWorksAnimation, setHowItWorksAnimation] = useState(false)
    const [testimonialsAnimation, setTestimonialsAnimation] = useState(false)
    const [ctaAnimation, setCtaAnimation] = useState(false)
    const [showModal, setShowModal] = useState(false)


    useEffect(() => {
        if (!user?.id) return;
        if (!checkAttendance?.hasAttended) {
            const timer = setTimeout(() => {
                setShowModal(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [user?.id, checkAttendance]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'hero') setHeroAnimation(true)
                    if (entry.target.id === 'services') setServicesAnimation(true)
                    if (entry.target.id === 'how-it-works') setHowItWorksAnimation(true)
                    if (entry.target.id === 'testimonials') setTestimonialsAnimation(true)
                    if (entry.target.id === 'cta') setCtaAnimation(true)
                }
            });
        });

        sectionRefs.current.forEach(ref => {
            if (ref) {
                observer.observe(ref)
            }
        })

        return () => {
            sectionRefs.current.forEach(ref => {
                if (ref) {
                    observer.unobserve(ref)
                }
            })
        }
    }, [])

    const zoomLevel = 1 + scrollY / 10000
    return (
        <div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
                    >
                        <div className="transform scale-90">
                            <AttendanceBoard
                                isLoggedIn={!!user?.id}
                                userId={user?.id}
                                attendance={attendance}
                                onClose={() => setShowModal(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative">
                <div
                    ref={(el) => {
                        sectionRefs.current[0] = el;
                    }}
                    id="hero"
                    className="relative h-screen flex items-center justify-center overflow-hidden"
                >
                    <BackToTop size={40} />
                    <div className="absolute inset-0 z-0" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}>
                        <EmblaCarousel slides={carouselItems} showControls={false} autoplay={true} />
                    </div>
                    <div className="relative container mx-auto px-4 py-40 h-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={heroAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex flex-col gap-8 max-w-2xl text-light mt-20">
                                <h1 className="text-5xl font-bold drop-shadow">
                                    Ghi lại khoảnh khắc hoàn hảo của bạn
                                </h1>
                                <p className="text-xl drop-shadow">
                                    Đặt lịch với các nhiếp ảnh gia, studio và nghệ sĩ trang điểm chuyên nghiệp tại cùng một nơi.
                                </p>
                                <div className="flex gap-4">
                                    <Link href="/booking" passHref>
                                        <Button width={160} height={50} className="text-lg text-white w-full">Đặt lịch ngay</Button>
                                    </Link>
                                    <Link href="/search/vendors" passHref>
                                        <ClearButton width={180} height={50} className="text-lg text-primary break-words whitespace-pre w-full">Khám phá dịch vụ</ClearButton>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Services section */}
            <motion.div
                id="services"
                className="flex container mx-auto px-4 py-16 items-center justify-center"
                ref={el => { sectionRefs.current[1] = el; }}
            >
                <div className="flex flex-col gap-8 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={servicesAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex flex-col gap-4 text-black items-center justify-center">
                            <h1 className="text-5xl break-words whitespace-pre-wrap font-bold">
                                Dịch vụ của chúng tôi
                            </h1>
                            <span className="text-center text-lg">PhotoGo cung cấp đầy đủ các dịch vụ chụp ảnh để đáp ứng mọi nhu cầu của bạn</span>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Photographers Card */}
                        <motion.div
                            className="p-8 shadow-xl rounded-xl flex flex-col gap-4 h-full hover:scale-105 transition-all duration-300 ease-in-out"
                            ref={el => { sectionRefs.current[2] = el; }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={servicesAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            <div className="bg-orange-100 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                                <LucideIcon name="Camera" iconSize={24} iconColor={"var(--orange)"} />
                            </div>
                            <div className="text-2xl font-bold">Photographers</div>
                            <span className="text-lg text-gray-600 min-h-[3rem]">Tìm nhiếp ảnh gia phù hợp với nhu cầu của bạn</span>
                            <div className="h-40 w-full relative rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg"
                                    alt="Photographers"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <ul className="list-none pl-5 text-lg space-y-2 my-2 flex-grow">
                                <li className="flex items-center gap-2">
                                    <LucideIcon name="Star" iconSize={16} iconColor="var(--orange)" />
                                    <span>Nhiều góp ghi khoảnh ngắm</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <LucideIcon name="Star" iconSize={16} iconColor="var(--orange)" />
                                    <span>Đa dạng phong cách chụp ảnh khác nhau</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <LucideIcon name="Star" iconSize={16} iconColor="var(--orange)" />
                                    <span>Lựa chọn linh hoạt</span>
                                </li>
                            </ul>
                            <Link href="/photographers" passHref>
                                <ClearButton iconColor="var(--orange)" iconSize={16} icon="MoveRight" iconPosition="right" className="border border-primary text-lg text-primary mt-auto w-full">
                                    Xem tất cả Photographers
                                </ClearButton>
                            </Link>
                        </motion.div>

                        {/* Studios Card */}
                        <motion.div
                            className="p-8 shadow-xl rounded-xl flex flex-col gap-4 h-full hover:scale-105 transition-all duration-300 ease-in-out"
                            ref={el => { sectionRefs.current[3] = el; }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={servicesAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-orange-100 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                                <LucideIcon name="Home" iconSize={24} iconColor={"var(--orange)"} />
                            </div>
                            <div className="text-2xl font-bold">Studios</div>
                            <span className="text-lg text-gray-600 min-h-[3rem]">Đặt phòng chụp ảnh cao cấp</span>
                            <div className="h-40 w-full relative rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg"
                                    alt="Photographers"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <ul className="list-none pl-5 text-lg space-y-2 my-2 flex-grow">
                                <li className="flex items-center gap-2">
                                    <LucideIcon name="Star" iconSize={16} iconColor="var(--orange)" />
                                    <span>Phòng studio được trang bị đầy đủ</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <LucideIcon name="Star" iconSize={16} iconColor="var(--orange)" />
                                    <span>Nhiều phông nền và ánh sáng khác nhau</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <LucideIcon name="Star" iconSize={16} iconColor="var(--orange)" />
                                    <span>Cho thuê theo giờ hoặc theo ngày</span>
                                </li>
                            </ul>
                            <Link href="/studios" passHref>
                                <ClearButton iconColor="var(--orange)" iconSize={16} icon="MoveRight" iconPosition="right" className="border border-primary text-lg text-primary mt-auto w-full">Đặt lịch Studio</ClearButton>
                            </Link>
                        </motion.div>

                        {/* Makeup Artists Card */}
                        <motion.div
                            className="p-8 shadow-xl rounded-xl flex flex-col gap-4 h-full hover:scale-105 transition-all duration-300 ease-in-out"
                            ref={el => { sectionRefs.current[4] = el; }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={servicesAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="bg-orange-100 rounded-full p-2 w-12 h-12 flex items-center justify-center">
                                <LucideIcon name="Palette" iconSize={24} iconColor={"var(--orange)"} />
                            </div>
                            <div className="text-2xl font-bold">Makeup Artists</div>
                            <span className="text-lg text-gray-600 min-h-[3rem] break-words whitespace-pre-wrap">Trang điểm chuyên nghiệp cho buổi chụp ảnh của bạn</span>
                            <div className="h-40 w-full relative rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg"
                                    alt="Photographers"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <ul className="list-none pl-5 text-lg space-y-2 my-2 flex-grow">
                                <li className="flex items-center gap-2">
                                    <LucideIcon name="Star" iconSize={16} iconColor="var(--orange)" />
                                    <span>Makeup artists chuyên nghiệp</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <LucideIcon name="Star" iconSize={16} iconColor="var(--orange)" />
                                    <span>Nhiều phong cách trang điểm khác nhau</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <LucideIcon name="Star" iconSize={16} iconColor="var(--orange)" />
                                    <span>Sản phẩm chất lượng cao cấp</span>
                                </li>
                            </ul>
                            <Link href="/makeup-artists" passHref className="w-full">
                                <ClearButton iconColor="var(--orange)" iconSize={16} icon="MoveRight" iconPosition="right" className="border border-primary text-lg text-primary mt-auto w-full">Đặt lịch với Makeup Artist</ClearButton>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* How it works section */}
            <motion.div
                id="how-it-works"
                className="bg-gray-50 py-16"
                ref={el => { sectionRefs.current[2] = el; }}
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={howItWorksAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex flex-col gap-4 text-black items-center justify-center">
                                <h1 className="text-5xl break-words whitespace-pre-wrap font-bold">
                                    Nền tảng chúng tôi hoạt động như thế nào
                                </h1>
                                <span className="text-center text-lg">Đặt lịch chụp ảnh hoàn hảo của bạn chưa bao giờ dễ dàng hơn thế</span>
                            </div>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Step items */}
                            {['Chọn dịch vụ', 'Chọn một chuyên gia', 'Chọn ngày', 'Tận hưởng dịch vụ của bạn'].map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="flex flex-col items-center text-center gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={howItWorksAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                >
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-light font-medium text-xl">{index + 1}</div>
                                    <h3 className="font-semibold text-lg">{step}</h3>
                                    <p className="text-md text-gray-600">Mô tả cho {step.toLowerCase()}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Testimonials section */}
            <motion.div
                id="testimonials"
                className="py-16"
                ref={el => { sectionRefs.current[3] = el; }}
            >
                <div className="">
                    <div className="flex flex-col gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={testimonialsAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex flex-col gap-4 text-black items-center justify-center">
                                <h1 className="text-5xl break-words whitespace-pre-wrap font-bold">
                                    Khách hàng của chúng tôi nói gì
                                </h1>
                                <span className="text-center text-lg">Hãy lắng nghe những người đã sử dụng dịch vụ của chúng tôi</span>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={testimonialsAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Testimonial cards */}
                            <div className="w-full h-full">

                                <AutoScrollCarousel slides={autoScrollItems} autoScroll={true} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* CTA section */}
            <motion.div
                id="cta"
                className="bg-gray-50 py-16"
                ref={el => { sectionRefs.current[4] = el; }}
            >
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={ctaAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex flex-col gap-4 text-black items-center justify-center">
                            <h1 className="text-5xl break-words whitespace-pre-wrap font-bold">
                                Bạn đã sẵn sàng đặt buổi chụp hình hoàn hảo của mình chưa?
                            </h1>
                            <span className="text-center text-lg break-words whitespace-pre-wrap">Tham gia cùng hàng ngàn khách hàng hài lòng đã tìm thấy sự kết hợp nhiếp ảnh hoàn hảo của họ với PhotoGo</span>
                        </div>
                        <div className="flex justify-center mt-8">
                            <Link href="/booking" passHref>
                                <Button width={160} height={40} className="text-lg text-white w-full">Đặt lịch ngay</Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </div >
    )
}

export default HomePage
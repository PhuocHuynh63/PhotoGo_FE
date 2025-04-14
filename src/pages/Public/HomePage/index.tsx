'use client'

import Button from "@components/Atoms/Button"
import ClearButton from "@components/Atoms/ClearButton"
import StarRating from "@components/Molecules/StarRating"
import Header from "@components/Organisms/Header"
import Image from "next/image"
import { useEffect, useState } from "react"

import LucideIcon from "@components/Atoms/LucideIcon"
import { Avatar } from "@components/Molecules/Avatar"

const HomePage = () => {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const zoomLevel = 1 + scrollY / 10000

    return (
        <div>
            {/* Hero section */}
            <Header />
            <div className="relative w-full h-[80vh] overflow-hidden">
                <div className="absolute inset-0 z-0" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}>
                    <Image
                        src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744562854/uploads/z6502220667569_f0146061d17b6485362a8027a1d81976.jpg"
                        alt="Background"
                        fill
                        quality={100}
                        loading="lazy"
                        blurDataURL="https://static-images.vnncdn.net/vps_images_publish/000001/000003/2025/1/20/ngan-ngam-thay-ca-si-jack-j97-72911.jpg?width=0&s=OQaz1tZ-7uFLA8UTXffWFQ"
                        className="object-cover brightness-50"
                    />
                </div>
                <div className="relative container mx-auto px-4 py-16">
                    <div className="flex flex-col gap-8 max-w-2xl text-primary mt-20">
                        <h1 className="text-5xl font-bold ">
                            Ghi lại khoảnh khắc hoàn hảo của bạn
                        </h1>
                        <p className="text-xl">
                            Đặt lịch với các nhiếp ảnh gia, studio và nghệ sĩ trang điểm chuyên nghiệp tại cùng một nơi.
                        </p>
                        <div className="flex gap-4">
                            <Button width={160} height={50} className="text-lg text-white">Đặt lịch ngay</Button>
                            <ClearButton width={180} height={50} className="text-lg text-primary break-words whitespace-pre">Khám phá dịch vụ</ClearButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services section */}
            <div className="flex container mx-auto px-4 py-16 items-center justify-center">
                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-4 text-black items-center justify-center">
                        <h1 className="text-5xl break-words whitespace-pre-wrap font-bold">
                            Dịch vụ của chúng tôi
                        </h1>
                        <span className="text-center text-lg">PhotoGo cung cấp đầy đủ các dịch vụ chụp ảnh để đáp ứng mọi nhu cầu của bạn</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Photographers Card */}
                        <div className="p-8 shadow-xl rounded-xl flex flex-col gap-4 h-full">
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
                            <ClearButton iconColor="var(--orange)" iconSize={16} icon="MoveRight" iconPosition="right" className="text-lg text-primary mt-auto">
                                Xem tất cả Photographers
                            </ClearButton>
                        </div>

                        {/* Studios Card */}
                        <div className="p-8 shadow-xl rounded-xl flex flex-col gap-4 h-full">
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
                            <ClearButton iconColor="var(--orange)" iconSize={16} icon="MoveRight" iconPosition="right" className="text-lg text-primary mt-auto">Đặt lịch Studio</ClearButton>
                        </div>

                        {/* Makeup Artists Card */}
                        <div className="p-8 shadow-xl rounded-xl flex flex-col gap-4 h-full">
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
                            <ClearButton iconColor="var(--orange)" iconSize={16} icon="MoveRight" iconPosition="right" className="text-lg text-primary mt-auto">Đặt lịch với Makeup Artist</ClearButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it works section */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4 text-black items-center justify-center">
                            <h1 className="text-5xl break-words whitespace-pre-wrap font-bold">
                                Nền tảng chúng tôi hoạt động như thế nà
                            </h1>
                            <span className="text-center text-lg">Đặt lịch chụp ảnh hoàn hảo của bạn chưa bao giờ dễ dàng hơn thế</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Step items */}
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-light font-medium text-xl">1</div>
                                <h3 className="font-semibold text-lg">Chọn dịch vụ</h3>
                                <p className="text-md text-gray-600">Chọn từ nhiều dịch vụ chụp ảnh khác nhau của chúng tôi</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-light font-medium text-xl">2</div>
                                <h3 className="font-semibold text-lg">Chọn một chuyên gia</h3>
                                <p className="text-md text-gray-600">Duyệt hồ sơ và chọn đối tượng phù hợp hoàn hảo của bạn</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-light font-medium text-xl">3</div>
                                <h3 className="font-semibold text-lg">Chọn ngày</h3>
                                <p className="text-md text-gray-600">Chọn ngày và giờ bạn muốn</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-light font-medium text-xl">4</div>
                                <h3 className="font-semibold text-lg">Tận hưởng dịch vụ của bạn</h3>
                                <p className="text-md text-gray-600">Thư giãn và tận hưởng buổi chụp ảnh chuyên nghiệp của bạn</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials section */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4 text-black items-center justify-center">
                            <h1 className="text-5xl break-words whitespace-pre-wrap font-bold">
                                Khách hàng của chúng tôi nói gì
                            </h1>
                            <span className="text-center text-lg">Hãy lắng nghe những người đã sử dụng dịch vụ của chúng tôi</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Testimonial cards */}
                            <div className="p-6 shadow-xl rounded-xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200">
                                        <Avatar size={50} src="https://cdn.tcdulichtphcm.vn/upload/4-2024/images/2024-11-11/1731317465-hnlh3081-copy.jpg" fallback="anh_jack_mat_vest" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Huỳnh Minh Phước</h4>
                                        <div className="flex text-yellow-400">
                                            <StarRating stars={3.5} size={16} color={"var(--orange)"} />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-md text-gray-600 break-words whitespace-pre-wrap">&quot;Nhiếp ảnh gia mà tôi đặt qua PHOTOGO thật tuyệt vời! Họ đã chụp ảnh cưới của tôi một cách tuyệt đẹp và rất chuyên nghiệp trong suốt ngày.&quot;</p>
                            </div>
                            <div className="p-6 shadow-xl rounded-xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200">
                                        <Avatar size={50} src="https://static-images.vnncdn.net/vps_images_publish/000001/000003/2025/1/20/ngan-ngam-thay-ca-si-jack-j97-72911.jpg?width=0&s=OQaz1tZ-7uFLA8UTXffWFQ" fallback="anh_jack_mat_vest" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Huỳnh Minh Phước</h4>
                                        <div className="flex text-yellow-400">
                                            <StarRating stars={5} size={16} color={"var(--orange)"} />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-md text-gray-600 break-words whitespace-pre-wrap">&quot;Studio tôi thuê rất lý tưởng cho buổi chụp ảnh sản phẩm của tôi. Được trang bị đầy đủ và quá trình đặt chỗ diễn ra suôn sẻ.&quot;</p>
                            </div>
                            <div className="p-6 shadow-xl rounded-xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200">
                                        <Avatar size={50} src="https://kenh14cdn.com/203336854389633024/2023/1/11/photo-3-1673436433884550875846.jpg" fallback="anh_jack_mat_vest" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Huỳnh Minh Phước</h4>
                                        <div className="flex text-yellow-400">
                                            <StarRating stars={4} size={16} color={"var(--orange)"} />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-md break-words whitespace-pre-wrap">&quot;Chuyên gia trang điểm mà tôi đã đặt thật tuyệt vời! Cô ấy hiểu chính xác những gì tôi muốn và giúp tôi trông thật tuyệt vời trong buổi chụp ảnh.&quot;</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <Button width={160} height={40} className="text-lg text-white">Xem thêm</Button>
                    </div>
                </div>
            </div>

            {/* CTA section */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 text-center">

                    <div className="flex flex-col gap-4 text-black items-center justify-center">
                        <h1 className="text-5xl break-words whitespace-pre-wrap font-bold">
                            Bạn đã sẵn sàng đặt buổi chụp hình hoàn hảo của mình chưa?
                        </h1>
                        <span className="text-center text-lg break-words whitespace-pre-wrap">Tham gia cùng hàng ngàn khách hàng hài lòng đã tìm thấy sự kết hợp nhiếp ảnh hoàn hảo của họ với PhotoGo</span>
                    </div>

                </div>
                <div className="flex justify-center mt-8">
                    <Button width={160} height={40} className="text-lg text-white">Đặt lịch ngay</Button>
                </div>
            </div>
        </div >
    )
}

export default HomePage
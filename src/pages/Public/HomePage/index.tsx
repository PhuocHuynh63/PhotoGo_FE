'use client'

import Button from "@components/Atoms/Button"
import ClearButton from "@components/Atoms/ClearButton"
import LucideIcon from "@components/Atoms/LucideIcon"
import Header from "@components/Organisms/Header"
import Image from "next/image"

const HomePage = () => {
    return (
        <div>
            <Header />
            {/* Hero section */}
            <div className="container mx-auto relative h-full">
                <div className="absolute inset-0">
                    <Image
                        src="https://res.cloudinary.com/dodtzdovx/image/upload/v1744187841/photogo_black_otpabv.svg"
                        alt="Background"
                        fill
                        className="object-cover brightness-50"
                    />
                </div>
                <div className="relative container mx-auto px-4 py-16">
                    <div className="flex flex-col gap-8 max-w-2xl text-black">
                        <h1 className="text-5xl font-bold ">
                            Ghi lại khoảnh khắc hoàn hảo của bạn
                        </h1>
                        <p className="text-lg ">
                            Đặt lịch với các nhiếp ảnh gia, studio và nghệ sĩ trang điểm chuyên nghiệp tại cùng một nơi.
                        </p>
                        <div className="flex gap-4">
                            <Button width={160} height={50}>Đặt lịch ngay</Button>
                            <ClearButton width={180} height={50}>Khám phá dịch vụ</ClearButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services section */}
            <div className="flex container mx-auto px-4 py-16 items-center justify-center">
                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-4 text-black items-center justify-center">
                        <h1 className="text-2xl font-bold">
                            Dịch vụ của chúng tôi
                        </h1>
                        <span className="text-center">PhotoGo cung cấp đầy đủ các dịch vụ chụp ảnh để đáp ứng mọi nhu cầu của bạn</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Photographers Card */}
                        <div className="p-6 border rounded-lg flex flex-col gap-4">
                            <div className="text-xl font-semibold">Photographers</div>
                            <span className="text-sm text-gray-600">Tìm nhiếp ảnh gia phù hợp với nhu cầu của bạn</span>
                            <div className="h-40 bg-gray-100 rounded-lg"></div>
                            <ul className="list-disc pl-5 text-sm">
                                <li>Nhiều góp ghi khoảnh ngắm</li>
                                <li>Đa dạng phong cách chụp ảnh khác nhau</li>
                                <li>Lựa chọn linh hoạt</li>
                            </ul>
                            <a href="#" className="text-orange-500 text-sm">Xem tất cả Photographers →</a>
                        </div>

                        {/* Studios Card */}
                        <div className="p-6 border rounded-lg flex flex-col gap-4">
                            {/* Similar structure as Photographers card */}
                        </div>

                        {/* Makeup Artists Card */}
                        <div className="p-6 border rounded-lg flex flex-col gap-4">
                            {/* Similar structure as Photographers card */}
                        </div>
                    </div>
                </div>
            </div>

            {/* How it works section */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">Nền tảng chúng tôi hoạt động như thế nào</h2>
                            <p className="text-gray-600">Đặt lịch chụp ảnh hoàn hảo của bạn chưa bao giờ dễ dàng hơn thế</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Step items */}
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-light font-medium">1</div>
                                <h3 className="font-semibold">Chọn dịch vụ</h3>
                                <p className="text-sm text-gray-600">Chọn từ nhiều dịch vụ chụp ảnh khác nhau của chúng tôi</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-light font-medium">2</div>
                                <h3 className="font-semibold">Chọn một chuyên gia</h3>
                                <p className="text-sm text-gray-600">Duyệt hồ sơ và chọn đối tượng phù hợp hoàn hảo của bạn</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-light font-medium">3</div>
                                <h3 className="font-semibold">Chọn ngày</h3>
                                <p className="text-sm text-gray-600">Chọn ngày và giờ bạn muốn</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-light font-medium">4</div>
                                <h3 className="font-semibold">Tận hưởng dịch vụ của bạn</h3>
                                <p className="text-sm text-gray-600">Thư giãn và tận hưởng buổi chụp ảnh chuyên nghiệp của bạn</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials section */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">Khách hàng của chúng tôi nói gì</h2>
                            <p className="text-gray-600">Hãy lắng nghe những người đã sử dụng dịch vụ của chúng tôi</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Testimonial cards */}
                            <div className="p-6 border rounded-lg">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                                    <div>
                                        <h4 className="font-semibold">Huỳnh Minh Phước</h4>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, index) => (
                                                <div key={index}>
                                                    <LucideIcon 
                                                        name="Star" 
                                                        fill={index < 3 ? "currentColor" : "none"}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Dịch vụ rất tốt...</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* CTA section */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Bạn đã sẵn sàng đặt buổi chụp hình hoàn hảo của mình chưa?</h2>
                    <p className="text-gray-600 mb-8">Tham gia cùng hàng trăm khách hàng đã tin tưởng và sử dụng dịch vụ của PhotoGo</p>
                    <Button width={160} height={50}>Đặt lịch ngay</Button>
                </div>
            </div>
        </div >
    )
}

export default HomePage
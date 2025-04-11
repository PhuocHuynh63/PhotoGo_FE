'use client'

import Button from "@components/Atoms/Button"
import ClearButton from "@components/Atoms/ClearButton"
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

                {/* Services section */}
            </div>
            <div className="flex container mx-auto px-4 py-16 items-center justify-center">
                <div className="flex flex-col gap-8 max-w-2xl text-black items-center justify-center">
                    <h1 className="text-5xl font-bold ">
                        Dịch vụ của chúng tôi
                    </h1>
                    <span>PhotoGo cung cấp đầy đủ các dịch vụ chụp ảnh để đáp ứng mọi nhu cầu của bạn</span>
                </div>
            </div>
        </div>
    )
}

export default HomePage
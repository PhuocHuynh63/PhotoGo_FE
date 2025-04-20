'use client'

import { Facebook, InstagramIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <>
            <footer className="bg-[#1A2526] text-white py-10 px-15 flex flex-wrap justify-between items-start text-sm">
                <div className="flex-1 min-w-[200px] mb-5">
                    <h3 className="text-base mb-3 flex items-center">
                        <Image
                            src="https://res.cloudinary.com/dodtzdovx/image/upload/v1745133550/mayanh_vxykeg.svg"
                            alt="Logo"
                            width={25}
                            height={25}
                            className="mr-2"
                        />
                        <span className='font-bold text-xl'>PHOTOGO</span>
                    </h3>
                    <p className="text-gray-400 leading-6 pr-48">
                        Nền tảng duy nhất của bạn để đặt lịch với các nhiếp ảnh gia, studio và nghệ sĩ trang điểm.
                    </p>
                    <div className="flex gap-4 mt-3">
                        <a href="https://www.facebook.com/gnuh.23" target="_blank" rel="noopener noreferrer">
                            <Facebook width={23} />
                        </a>
                        <a href='https://www.instagram.com/phuoc.huynh63/' target="_blank" rel="noopener noreferrer">
                            <InstagramIcon width={23} />
                        </a>

                    </div>
                </div>

                <div className="flex-1 min-w-[200px] mb-5">
                    <h3 className="text-base mb-3">Dịch vụ</h3>
                    <ul className="text-gray-400 list-none p-0">
                        <li className="mb-2"><Link href="#" className="text-gray-400 no-underline hover:underline">Chụp ảnh trong studip</Link></li>
                        <li className="mb-2"><Link href="#" className="text-gray-400 no-underline hover:underline">Chụp ảnh với freelancer</Link></li>
                        <li className="mb-2"><Link href="#" className="text-gray-400 no-underline hover:underline">Dịch vụ trang điểm</Link></li>
                    </ul>
                </div>

                <div className="flex-1 min-w-[200px] mb-5">
                    <h3 className="text-base mb-3">Chính sách</h3>
                    <ul className="text-gray-400 list-none p-0">
                        <li className="mb-2"><a href="#" className="text-gray-400 no-underline hover:underline">Điều khoản sử dụng</a></li>
                        <li className="mb-2"><a href="#" className="text-gray-400 no-underline hover:underline">Chính sách bảo mật</a></li>
                        <li className="mb-2"><a href="#" className="text-gray-400 no-underline hover:underline">Quy định đặt lịch</a></li>
                        <li className="mb-2"><a href="#" className="text-gray-400 no-underline hover:underline">Chính sách huỷ/đổi</a></li>
                    </ul>
                </div>

                {/* <div className="flex-1 min-w-[200px] mb-5">
                    <h3 className="text-base mb-3">Kết nối với chúng tôi</h3>

                    <button className="bg-[#D4A017] text-white border-none py-2 px-5 rounded-md cursor-pointer text-sm hover:bg-[#e0b52e]">
                        Trở thành đối tác
                    </button>
                    <p className="text-gray-400 mt-3">
                        Đăng ký nhận bản tin của chúng tôi để cập nhật mới nhất
                    </p>
                </div> */}

                <div className="w-full text-center text-gray-400 text-xs mt-5 border-t border-gray-700 pt-5">
                    © 2025 PHOTOGO. Tất cả đều được bảo lưu.
                </div>
            </footer>
        </>
    )
}

export default Footer
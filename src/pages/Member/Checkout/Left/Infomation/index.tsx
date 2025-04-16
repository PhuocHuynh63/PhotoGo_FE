'use client'

import Button from '@components/Atoms/Button'
import Checkbox from '@components/Atoms/Checkbox'
import Input from '@components/Atoms/Input'
import TextArea from '@components/Atoms/TextArea'
import React from 'react'

const Infomation = () => {
    return (
        <>
            <div className="space-y-6">
                <div>
                    <label htmlFor="fullname" className="block text-sm font-medium mb-2">
                        Họ và tên
                    </label>
                    <Input id="fullname" defaultValue="Huỳnh Minh Phước" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <Input id="email" type="email" defaultValue="phuochmse17830@fpt.edu.vn" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                            Số điện thoại
                        </label>
                        <Input id="phone" defaultValue="1900-8099" />
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-2">
                        Địa chỉ
                    </label>
                    <Input id="address" placeholder="Nhập địa chỉ của bạn" />
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-2">
                        Ghi chú
                    </label>
                    <TextArea id="notes" placeholder="Ghi chú thêm (nếu có)" rows={4} />
                </div>

                <div className="flex items-start space-x-2">
                    <Checkbox id="terms" />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Tôi đồng ý với{" "}
                            <Button className="text-[#f0a06a]">
                                điều khoản và điều kiện
                            </Button>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Infomation
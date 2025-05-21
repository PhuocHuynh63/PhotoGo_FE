'use client';

import { useState } from "react";
import { Card } from "@components/Atoms/Card";
import Button from "@components/Atoms/Button";
import { Heart, Users, Brush, Baby, Smile, Wand2, Snowflake, Sparkles, Gift, BellRing } from "lucide-react";

import { format } from "date-fns";
import { cn } from "@helpers/CN";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Molecules/Tabs";
import { motion, AnimatePresence } from "framer-motion"; // thêm dòng này

const promotions = [
    // Existing 3 promotions...

    {
        id: 4,
        code: "LOVE20",
        title: "Couple Photoshoot",
        description: "Giảm 20% cho cặp đôi khi chụp ngoại cảnh",
        discount: 20,
        expiry: "2025-11-15",
        isUsed: false,
        icon: <Heart className="w-5 h-5 text-pink-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 5,
        code: "FAMILY25",
        title: "Album Gia Đình",
        description: "Giảm 25% cho album gia đình trên 2 triệu",
        discount: 25,
        expiry: "2025-10-01",
        isUsed: false,
        icon: <Users className="w-5 h-5 text-blue-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 6,
        code: "WEDDING30",
        title: "Ưu đãi cưới hỏi",
        description: "Giảm 30% khi book trọn gói chụp ảnh cưới",
        discount: 30,
        expiry: "2026-01-10",
        isUsed: true,
        icon: <BellRing className="w-5 h-5 text-purple-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 7,
        code: "MAKEUP5",
        title: "Trang điểm nhẹ nhàng",
        description: "Giảm 5% cho dịch vụ makeup cá nhân",
        discount: 5,
        expiry: "2024-09-10",
        isUsed: true,
        icon: <Brush className="w-5 h-5 text-rose-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 8,
        code: "KIDSHOT15",
        title: "Chụp ảnh bé yêu",
        description: "Giảm 15% khi chụp ảnh cho bé dưới 6 tuổi",
        discount: 15,
        expiry: "2025-08-22",
        isUsed: false,
        icon: <Baby className="w-5 h-5 text-yellow-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 9,
        code: "BFF10",
        title: "Chụp ảnh bạn thân",
        description: "Giảm 10% khi đặt lịch chụp nhóm bạn từ 3 người",
        discount: 10,
        expiry: "2025-07-14",
        isUsed: false,
        icon: <Smile className="w-5 h-5 text-green-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 10,
        code: "RETOUCH50",
        title: "Chỉnh sửa ảnh cao cấp",
        description: "Giảm 50% cho dịch vụ retouch ảnh chuyên nghiệp",
        discount: 50,
        expiry: "2024-12-31",
        isUsed: true,
        icon: <Wand2 className="w-5 h-5 text-indigo-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 11,
        code: "STUDIOXMAS",
        title: "Giáng Sinh 2025",
        description: "Giảm 12% cho buổi chụp trong studio dịp Noel",
        discount: 12,
        expiry: "2025-12-25",
        isUsed: false,
        icon: <Snowflake className="w-5 h-5 text-sky-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 12,
        code: "NEWYEAR24",
        title: "Đầu năm rực rỡ",
        description: "Giảm 18% khi chụp ảnh Tết Nguyên Đán",
        discount: 18,
        expiry: "2025-02-01",
        isUsed: true,
        icon: <Sparkles className="w-5 h-5 text-red-400 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 13,
        code: "BIRTHDAYGIFT",
        title: "Quà sinh nhật đặc biệt",
        description: "Giảm 20% cho khách hàng chụp ảnh dịp sinh nhật",
        discount: 20,
        expiry: "2025-12-31",
        isUsed: false,
        icon: <Gift className="w-5 h-5 text-fuchsia-300 absolute top-2 right-2 opacity-30" />,
    },
];



export default function PromotionsPage() {
    const [tab, setTab] = useState("active");

    const filterPromos = (type: string) => {
        return promotions.filter((p) => {
            if (type === "active") return !p.isUsed;
            if (type === "used") return p.isUsed;
        });
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">Ưu đãi dành cho bạn</h1>

            <Tabs defaultValue="active" value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid grid-cols-3 gap-2 bg-orange-100 p-1 rounded-xl max-w-md mx-auto mb-6">
                    <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
                    <TabsTrigger value="used">Đã sử dụng</TabsTrigger>
                </TabsList>

                {["active", "used"].map((status) => (
                    <TabsContent value={status} key={status}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                            <AnimatePresence mode="wait">
                                {filterPromos(status).map((promo) => (
                                    <motion.div
                                        key={promo.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        <Card
                                            className={cn(
                                                "relative flex border border-orange-200 bg-orange-50 shadow-sm rounded-xl overflow-hidden hover:scale-[1.01] transition-transform duration-200"
                                            )}
                                        >
                                            {promo.icon}

                                            {/* Left */}
                                            <div className="p-5 w-2/3 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-orange-600">{promo.title}</h3>
                                                    <p className="text-sm text-gray-700 mt-1">{promo.description}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-3">
                                                    HSD: {format(new Date(promo.expiry), 'dd/MM/yyyy')}
                                                </p>
                                            </div>

                                            {/* Right */}
                                            <div className="w-1/3 bg-white border-l border-dashed border-orange-300 flex flex-col justify-center items-center p-4 text-center">
                                                <span className="text-xs text-gray-500 mb-1">Mã ưu đãi</span>
                                                <div className="bg-orange-100 px-3 py-1 rounded-md font-mono text-orange-600 text-base font-bold tracking-wider shadow-inner">
                                                    {promo.code}
                                                </div>

                                                {/* Button or Status */}
                                                {status === "active" && (
                                                    <div className="flex flex-col justify-center items-center mt-3">

                                                        <Button className="mt-3 text-orange-500 border-orange-300 hover:bg-orange-100 w-full">
                                                            Sử dụng ngay
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Animation cho trạng thái đã dùng và hết hạn */}
                                                {status === "used" && (
                                                    <motion.span
                                                        className="text-xs text-gray-400 mt-3 italic"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        Đã sử dụng
                                                    </motion.span>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {filterPromos(status).length === 0 && (
                                <div className="text-center py-12 col-span-full">
                                    <Gift className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-4 text-gray-500">Không có ưu đãi nào trong mục này</p>
                                    {status === "active" && <Button className="mt-4">Khám phá ưu đãi</Button>}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

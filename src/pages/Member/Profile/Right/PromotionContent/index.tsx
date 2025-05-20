'use client';

import { useState } from "react";
import { Card } from "@components/Atoms/Card";
import Button from "@components/Atoms/Button";
import { Camera, Building, Gift, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@helpers/CN";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Molecules/Tabs";
import { motion, AnimatePresence } from "framer-motion"; // thêm dòng này

const promotions = [
    {
        id: 1,
        code: "PHOTO10",
        title: "Chụp Ảnh Nghệ Thuật",
        description: "Giảm 10% cho buổi chụp nghệ thuật trên 1 triệu",
        discount: 10,
        expiry: "2025-12-30",
        isUsed: false,
        icon: <Camera className="w-5 h-5 text-orange-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 2,
        code: "STUDIO15",
        title: "Studio + Makeup",
        description: "Giảm 15% khi đặt studio và makeup",
        discount: 15,
        expiry: "2024-12-30",
        isUsed: true,
        icon: <Building className="w-5 h-5 text-orange-300 absolute top-2 right-2 opacity-30" />,
    },
    {
        id: 3,
        code: "SKIBIDI",
        title: "Trải nghiệm trọn bộ",
        description: "Giảm 20% khi đặt trải nghiệm trọn bộ",
        discount: 20,
        expiry: "2025-12-30",
        isUsed: false,
        icon: <XCircle className="w-5 h-5 text-red-300 absolute top-2 right-2 opacity-30" />,
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
                        <AnimatePresence mode="wait">
                            {filterPromos(status).map((promo) => (
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2"
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
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

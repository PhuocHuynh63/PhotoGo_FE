import Button from "@components/Atoms/Button";
import { Card } from "@components/Atoms/Card";
import { Badge, Gift } from "lucide-react";

export default function PromotionsContent(/*{ promotions }*/) {
    const promotions = [{
        id: 1,
        code: "PROMO10",
        expiry: "2023-12-31",
        description: "Giảm 10% cho đơn hàng trên 100k",
        discount: 10,
        title: 'đasad',
        type: "percentage",
        usageLimit: 100,
        usageCount: 50,
        isActive: true,
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
    },
    {
        id: 2,
        code: "PROMO20",
        expiry: "2023-12-31",
        description: "Giảm 20% cho đơn hàng trên 200k",
        discount: 20,
        title: 'đasad',
        type: "percentage",
        usageLimit: 50,
        usageCount: 25,
        isActive: true,
        createdAt: "2023-01-01",
    }]
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Mã khuyến mãi</h1>
            <div className="space-y-4">
                {promotions.map((promo) => (
                    <Card key={promo.id} className="overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <Badge className="text-orange-500 border-orange-200">
                                    {promo.code}
                                </Badge>
                                <span className="text-xs text-gray-500">Hết hạn: {promo.expiry}</span>
                            </div>
                            <h3 className="font-medium mt-2">{promo.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{promo.description}</p>
                            <Button variant="outline" className="w-full mt-3">
                                Sử dụng ngay
                            </Button>
                        </div>
                    </Card>
                ))}

                {promotions.length === 0 && (
                    <div className="text-center py-12">
                        <Gift className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-4 text-gray-500">Bạn chưa có mã khuyến mãi nào</p>
                        <Button className="mt-4">Khám phá ưu đãi</Button>
                    </div>
                )}
            </div>
        </div>
    )
}